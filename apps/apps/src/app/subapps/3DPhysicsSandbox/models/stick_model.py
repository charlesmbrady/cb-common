import bpy
from mathutils import Vector
import math

# ============================================================
# TOGGLES
# ============================================================
ENABLE_IK = False  # Uses EMPTY targets (stable). Turn on when you want foot planting.
GENERATE_WALK = True  # Create an Action named "Walk"

ARMATURE_NAME = "StickmanArmature"
ACTION_NAME = "Walk"

FPS = 24
DURATION_FRAMES = 24  # 1 second walk loop at 24 fps

# ============================================================
# WALK TUNING (radians / meters)
# ============================================================
PELVIS_BOB = 0.06
PELVIS_SWAY = 0.03
PELVIS_TWIST = math.radians(8)
PELVIS_LEAN = 0.0  # 0 = stand straight; negative leans forward (e.g. math.radians(-6))

HIP_SWING = math.radians(35)
HIP_OUT = math.radians(8)
KNEE_BEND = math.radians(
    45
)  # knee bends forward in this rig as NEGATIVE X (see generator)

ARM_SWING = math.radians(22)
ELBOW_BEND = math.radians(20)

# Arms hang-down bias (makes arms down by sides)
ARM_REST_X = math.radians(-25)  # try -15..-45
ARM_REST_Z_L = math.radians(10)
ARM_REST_Z_R = math.radians(-10)


# ============================================================
# UTILS
# ============================================================
def deg(d):
    return math.radians(d)


def clear_scene():
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)

    for datablock in (
        bpy.data.meshes,
        bpy.data.armatures,
        bpy.data.materials,
        bpy.data.images,
        bpy.data.actions,
    ):
        for block in list(datablock):
            try:
                datablock.remove(block)
            except:
                pass


def deselect_all():
    for o in bpy.context.view_layer.objects:
        o.select_set(False)


def set_active(obj):
    deselect_all()
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj


def ensure_object_mode():
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")


def mirror_x(v: Vector) -> Vector:
    return Vector((-v.x, v.y, v.z))


def swap_lr(name: str) -> str:
    if name.endswith(".L"):
        return name[:-2] + ".R"
    if name.endswith(".R"):
        return name[:-2] + ".L"
    return name


# ============================================================
# GEOMETRY HELPERS
# ============================================================
def make_box_between(
    head, tail, thickness=(0.08, 0.08), length_scale=1.15, name="part_geo"
):
    v = tail - head
    if v.length < 1e-6:
        v = Vector((0, 0, 1))

    base_len = max(v.length, 0.1)
    length = base_len * length_scale
    direction = v.normalized()
    mid = (head + tail) / 2.0

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=mid)
    obj = bpy.context.active_object
    obj.name = name

    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = direction.to_track_quat("Z", "Y")

    obj.scale = (thickness[0], thickness[1], length / 2.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bpy.ops.object.shade_flat()
    return obj


def make_head_block_at(pos, size=(0.20, 0.20, 0.22), name="head_geo"):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=pos)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bpy.ops.object.shade_flat()
    return obj


# ============================================================
# BONE WORLD TRANSFORMS + PARENTING
# ============================================================
def pose_bone_head_tail_world(arm_obj, bone_name):
    pb = arm_obj.pose.bones.get(bone_name)
    if pb is None:
        raise KeyError(f'Pose bone "{bone_name}" not found')

    head_local = Vector((0, 0, 0, 1))
    tail_local = Vector((0, pb.length, 0, 1))

    m_world = arm_obj.matrix_world @ pb.matrix
    head_world = (m_world @ head_local).to_3d()
    tail_world = (m_world @ tail_local).to_3d()
    return head_world, tail_world


def bone_parent_keep_world(obj, arm_obj, bone_name):
    pb = arm_obj.pose.bones[bone_name]
    parent_mat = arm_obj.matrix_world @ pb.matrix
    world_mat = obj.matrix_world.copy()

    obj.parent = arm_obj
    obj.parent_type = "BONE"
    obj.parent_bone = bone_name

    obj.matrix_parent_inverse = parent_mat.inverted()
    obj.matrix_world = world_mat


# ============================================================
# RIG BUILD (MIRRORED)
# ============================================================
def create_minimal_rig_mirrored(name=ARMATURE_NAME):
    ensure_object_mode()
    bpy.ops.object.armature_add(enter_editmode=True, location=(0, 0, 0))
    arm_obj = bpy.context.active_object
    arm_obj.name = name
    arm = arm_obj.data
    arm.name = f"{name}Data"

    eb = arm.edit_bones
    eb.remove(eb[0])

    def new_bone(bname, head, tail, parent=None):
        b = eb.new(bname)
        b.head = Vector(head)
        b.tail = Vector(tail)
        if parent:
            b.parent = eb[parent]
            b.use_connect = False
        return b

    # Center bones
    center_bones = [
        ("pelvis", (0, 0, 1.00), (0, 0, 1.12), None),
        ("lower_spine", (0, 0, 1.12), (0, 0, 1.40), "pelvis"),
        ("upper_spine", (0, 0, 1.40), (0, 0, 1.68), "lower_spine"),
        ("neck", (0, 0, 1.68), (0, 0, 1.80), "upper_spine"),
        ("head", (0, 0, 1.80), (0, 0, 1.98), "neck"),
    ]
    for bname, head, tail, parent in center_bones:
        new_bone(bname, head, tail, parent)

    # Left bones (mirror to right)
    left_bones = [
        ("clavicle.L", (0.05, 0, 1.62), (0.22, 0, 1.60), "upper_spine"),
        ("upper_arm.L", (0.22, 0, 1.60), (0.55, 0, 1.52), "clavicle.L"),
        ("lower_arm.L", (0.55, 0, 1.52), (0.85, 0, 1.44), "upper_arm.L"),
        ("hip.L", (0.00, 0, 1.02), (0.16, 0, 1.00), "pelvis"),
        ("upper_leg.L", (0.16, 0, 1.00), (0.18, 0, 0.65), "hip.L"),
        ("lower_leg.L", (0.18, 0, 0.65), (0.18, 0, 0.28), "upper_leg.L"),
        ("foot.L", (0.18, 0, 0.28), (0.18, 0.18, 0.28), "lower_leg.L"),
    ]
    for bname, head, tail, parent in left_bones:
        new_bone(bname, head, tail, parent)

    for bname, head, tail, parent in left_bones:
        bname_r = swap_lr(bname)
        head_r = mirror_x(Vector(head))
        tail_r = mirror_x(Vector(tail))
        parent_r = swap_lr(parent) if parent else None
        new_bone(bname_r, head_r, tail_r, parent_r)

    bpy.ops.object.mode_set(mode="OBJECT")
    arm.display_type = "STICK"
    arm_obj.show_in_front = True
    return arm_obj


# ============================================================
# OPTIONAL IK (EMPTY TARGETS - STABLE)
# ============================================================
def add_ik_controls_empty(arm_obj):
    """
    Creates empties:
      - foot_target.L / foot_target.R
      - knee_pole.L / knee_pole.R
    Adds IK on lower_leg.* (chain_count=2)
    """
    ensure_object_mode()
    set_active(arm_obj)

    # Delete prior empties if rerun
    for side in ("L", "R"):
        for name in (f"foot_target.{side}", f"knee_pole.{side}"):
            o = bpy.data.objects.get(name)
            if o:
                bpy.data.objects.remove(o, do_unlink=True)

    def w_head(bname):
        head, _ = pose_bone_head_tail_world(arm_obj, bname)
        return head

    def w_tail(bname):
        _, tail = pose_bone_head_tail_world(arm_obj, bname)
        return tail

    empties = {}

    for side in ("L", "R"):
        toe = w_tail(f"foot.{side}")
        knee = w_head(f"lower_leg.{side}")

        foot_loc = toe + Vector((0.0, 0.10, 0.00))  # forward (+Y)
        pole_loc = knee + Vector(
            (0.0, 0.35, 0.00)
        )  # forward (+Y) to define knee direction

        foot_empty = bpy.data.objects.new(f"foot_target.{side}", None)
        foot_empty.empty_display_type = "PLAIN_AXES"
        foot_empty.location = foot_loc
        bpy.context.collection.objects.link(foot_empty)

        pole_empty = bpy.data.objects.new(f"knee_pole.{side}", None)
        pole_empty.empty_display_type = "PLAIN_AXES"
        pole_empty.location = pole_loc
        bpy.context.collection.objects.link(pole_empty)

        empties[side] = (foot_empty, pole_empty)

    bpy.ops.object.mode_set(mode="POSE")

    for side in ("L", "R"):
        lower_leg = arm_obj.pose.bones[f"lower_leg.{side}"]

        # remove existing IK constraints if rerun
        for c in list(lower_leg.constraints):
            if c.type == "IK":
                lower_leg.constraints.remove(c)

        foot_empty, pole_empty = empties[side]

        c = lower_leg.constraints.new(type="IK")
        c.target = foot_empty
        c.pole_target = pole_empty
        c.chain_count = 2
        c.pole_angle = 0.0
        c.use_stretch = False

    bpy.ops.object.mode_set(mode="OBJECT")
    set_active(arm_obj)


# ============================================================
# BLOCKS
# ============================================================
def length_scale_for_bone(bone: str) -> float:
    if bone in ("pelvis", "neck"):
        return 1.05
    if "spine" in bone:
        return 1.08
    if "clavicle" in bone or bone.startswith("hip"):
        return 1.12
    return 1.18


def build_blocks(arm_obj):
    thickness = {
        "pelvis": (0.18, 0.12),
        "lower_spine": (0.16, 0.12),
        "upper_spine": (0.18, 0.14),
        "neck": (0.08, 0.08),
        "clavicle.L": (0.07, 0.07),
        "upper_arm.L": (0.08, 0.08),
        "lower_arm.L": (0.07, 0.07),
        "hip.L": (0.09, 0.09),
        "upper_leg.L": (0.10, 0.10),
        "lower_leg.L": (0.09, 0.09),
        "foot.L": (0.10, 0.05),  # skinnier
        "clavicle.R": (0.07, 0.07),
        "upper_arm.R": (0.08, 0.08),
        "lower_arm.R": (0.07, 0.07),
        "hip.R": (0.09, 0.09),
        "upper_leg.R": (0.10, 0.10),
        "lower_leg.R": (0.09, 0.09),
        "foot.R": (0.10, 0.05),  # skinnier
    }

    for bone, thick in thickness.items():
        head, tail = pose_bone_head_tail_world(arm_obj, bone)
        obj = make_box_between(
            head,
            tail,
            thickness=thick,
            length_scale=length_scale_for_bone(bone),
            name=f"{bone}_geo",
        )
        bone_parent_keep_world(obj, arm_obj, bone)

    _, head_tail = pose_bone_head_tail_world(arm_obj, "head")
    head_geo = make_head_block_at(head_tail, name="head_geo")
    bone_parent_keep_world(head_geo, arm_obj, "head")


# ============================================================
# GAMEY LIMITS
# ============================================================
def clear_pose_constraints(arm_obj):
    for pb in arm_obj.pose.bones:
        for c in list(pb.constraints):
            pb.constraints.remove(c)


def add_limit_rotation(
    pb,
    use_x=True,
    use_y=True,
    use_z=True,
    min_x=0.0,
    max_x=0.0,
    min_y=0.0,
    max_y=0.0,
    min_z=0.0,
    max_z=0.0,
):
    c = pb.constraints.new(type="LIMIT_ROTATION")
    c.owner_space = "LOCAL"
    c.use_limit_x = use_x
    c.use_limit_y = use_y
    c.use_limit_z = use_z
    c.min_x = min_x
    c.max_x = max_x
    c.min_y = min_y
    c.max_y = max_y
    c.min_z = min_z
    c.max_z = max_z
    return c


def apply_gamey_limits(arm_obj):
    ensure_object_mode()
    set_active(arm_obj)
    bpy.ops.object.mode_set(mode="POSE")

    clear_pose_constraints(arm_obj)

    # Torso
    add_limit_rotation(
        arm_obj.pose.bones["pelvis"],
        min_x=deg(-25),
        max_x=deg(25),
        min_y=deg(-20),
        max_y=deg(20),
        min_z=deg(-35),
        max_z=deg(35),
    )
    add_limit_rotation(
        arm_obj.pose.bones["lower_spine"],
        min_x=deg(-20),
        max_x=deg(20),
        min_y=deg(-15),
        max_y=deg(15),
        min_z=deg(-25),
        max_z=deg(25),
    )
    add_limit_rotation(
        arm_obj.pose.bones["upper_spine"],
        min_x=deg(-25),
        max_x=deg(25),
        min_y=deg(-20),
        max_y=deg(20),
        min_z=deg(-35),
        max_z=deg(35),
    )
    add_limit_rotation(
        arm_obj.pose.bones["neck"],
        min_x=deg(-25),
        max_x=deg(25),
        min_y=deg(-25),
        max_y=deg(25),
        min_z=deg(-30),
        max_z=deg(30),
    )
    add_limit_rotation(
        arm_obj.pose.bones["head"],
        min_x=deg(-30),
        max_x=deg(30),
        min_y=deg(-30),
        max_y=deg(30),
        min_z=deg(-35),
        max_z=deg(35),
    )

    # Arms
    for side in ("L", "R"):
        add_limit_rotation(
            arm_obj.pose.bones[f"clavicle.{side}"],
            min_x=deg(-20),
            max_x=deg(20),
            min_y=deg(-15),
            max_y=deg(15),
            min_z=deg(-25),
            max_z=deg(25),
        )
        add_limit_rotation(
            arm_obj.pose.bones[f"upper_arm.{side}"],
            min_x=deg(-90),
            max_x=deg(90),
            min_y=deg(-60),
            max_y=deg(60),
            min_z=deg(-120),
            max_z=deg(120),
        )
        # Elbow hinge-like
        add_limit_rotation(
            arm_obj.pose.bones[f"lower_arm.{side}"],
            min_x=deg(0),
            max_x=deg(140),
            min_y=deg(-10),
            max_y=deg(10),
            min_z=deg(-10),
            max_z=deg(10),
        )

    # Legs
    for side in ("L", "R"):
        add_limit_rotation(
            arm_obj.pose.bones[f"hip.{side}"],
            min_x=deg(-40),
            max_x=deg(60),
            min_y=deg(-30),
            max_y=deg(30),
            min_z=deg(-35),
            max_z=deg(35),
        )
        add_limit_rotation(
            arm_obj.pose.bones[f"upper_leg.{side}"],
            min_x=deg(-60),
            max_x=deg(90),
            min_y=deg(-35),
            max_y=deg(35),
            min_z=deg(-35),
            max_z=deg(35),
        )
        # Knee hinge-like (bends forward: negative X)
        add_limit_rotation(
            arm_obj.pose.bones[f"lower_leg.{side}"],
            min_x=deg(-150),
            max_x=deg(0),
            min_y=deg(-8),
            max_y=deg(8),
            min_z=deg(-8),
            max_z=deg(8),
        )
        add_limit_rotation(
            arm_obj.pose.bones[f"foot.{side}"],
            min_x=deg(-25),
            max_x=deg(25),
            min_y=deg(-15),
            max_y=deg(15),
            min_z=deg(-20),
            max_z=deg(20),
        )

    bpy.ops.object.mode_set(mode="OBJECT")
    set_active(arm_obj)


# ============================================================
# WALK ANIMATION (FK)
# ============================================================
def ensure_action(arm):
    if arm.animation_data is None:
        arm.animation_data_create()
    act = bpy.data.actions.get(ACTION_NAME)
    if act is None:
        act = bpy.data.actions.new(ACTION_NAME)
    arm.animation_data.action = act
    return act


def set_pose_rotation(pb, rot_xyz):
    pb.rotation_mode = "XYZ"
    pb.rotation_euler.x = rot_xyz[0]
    pb.rotation_euler.y = rot_xyz[1]
    pb.rotation_euler.z = rot_xyz[2]


def key_rot(pb, frame):
    pb.keyframe_insert(data_path="rotation_euler", frame=frame)


def key_loc(pb, frame):
    pb.keyframe_insert(data_path="location", frame=frame)


def generate_walk_action(arm_obj):
    ensure_object_mode()
    set_active(arm_obj)
    bpy.ops.object.mode_set(mode="POSE")

    ensure_action(arm_obj)

    pb = arm_obj.pose.bones
    pelvis = pb["pelvis"]
    lower_spine = pb["lower_spine"]
    upper_spine = pb["upper_spine"]

    upper_leg_L = pb["upper_leg.L"]
    lower_leg_L = pb["lower_leg.L"]
    upper_leg_R = pb["upper_leg.R"]
    lower_leg_R = pb["lower_leg.R"]

    upper_arm_L = pb["upper_arm.L"]
    lower_arm_L = pb["lower_arm.L"]
    upper_arm_R = pb["upper_arm.R"]
    lower_arm_R = pb["lower_arm.R"]

    start = 1
    end = start + DURATION_FRAMES

    for f in range(start, end + 1):
        t = (f - start) / DURATION_FRAMES
        phase = t * (2 * math.pi)

        legL = math.sin(phase)
        legR = math.sin(phase + math.pi)

        liftL = max(0.0, legL)
        liftR = max(0.0, legR)

        pelvis.location = (
            PELVIS_SWAY * math.sin(phase),
            0.0,
            PELVIS_BOB * (0.5 + 0.5 * math.sin(phase * 2)),
        )
        set_pose_rotation(
            pelvis, (PELVIS_LEAN, 0.0, PELVIS_TWIST * math.sin(phase))  # 0 = straight
        )

        set_pose_rotation(
            lower_spine, (0.0, 0.0, -0.35 * PELVIS_TWIST * math.sin(phase))
        )
        set_pose_rotation(
            upper_spine, (0.0, 0.0, -0.25 * PELVIS_TWIST * math.sin(phase))
        )

        set_pose_rotation(upper_leg_L, (HIP_SWING * legL, HIP_OUT, 0.0))
        set_pose_rotation(upper_leg_R, (HIP_SWING * legR, -HIP_OUT, 0.0))

        # Knee bends forward for this rig as NEGATIVE X
        set_pose_rotation(lower_leg_L, (-KNEE_BEND * liftL, 0.0, 0.0))
        set_pose_rotation(lower_leg_R, (-KNEE_BEND * liftR, 0.0, 0.0))

        # Arms: rest down by sides + swing
        set_pose_rotation(
            upper_arm_L, (ARM_REST_X + ARM_SWING * legR, 0.0, ARM_REST_Z_L)
        )
        set_pose_rotation(
            upper_arm_R, (ARM_REST_X + ARM_SWING * legL, 0.0, ARM_REST_Z_R)
        )

        # Elbows slight bend always + extra on forward swing
        set_pose_rotation(
            lower_arm_L, (ELBOW_BEND + math.radians(10) * max(0.0, legR), 0.0, 0.0)
        )
        set_pose_rotation(
            lower_arm_R, (ELBOW_BEND + math.radians(10) * max(0.0, legL), 0.0, 0.0)
        )

        key_loc(pelvis, f)
        key_rot(pelvis, f)
        key_rot(lower_spine, f)
        key_rot(upper_spine, f)

        key_rot(upper_leg_L, f)
        key_rot(lower_leg_L, f)
        key_rot(upper_leg_R, f)
        key_rot(lower_leg_R, f)

        key_rot(upper_arm_L, f)
        key_rot(lower_arm_L, f)
        key_rot(upper_arm_R, f)
        key_rot(lower_arm_R, f)

    bpy.ops.object.mode_set(mode="OBJECT")
    set_active(arm_obj)
    print(f'✅ Created Action "{ACTION_NAME}" ({DURATION_FRAMES} frames @ {FPS}fps).')


# ============================================================
# MAIN
# ============================================================
def main():
    clear_scene()

    arm = create_minimal_rig_mirrored()
    build_blocks(arm)
    apply_gamey_limits(arm)

    if ENABLE_IK:
        add_ik_controls_empty(arm)

    if GENERATE_WALK:
        generate_walk_action(arm)

    set_active(arm)
    print(
        "✅ Done. (ENABLE_IK uses empties; walk stands straight; arms hang naturally.)"
    )


main()

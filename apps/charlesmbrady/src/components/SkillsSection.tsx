import { Section } from './Section';
import { SectionTitle } from './SectionTitle';

/* ------------------------------ Define Skills ----------------------------- */
const skills = [
  'React',
  'Node.js',
  'TypeScript',
  'AWS',
  'Serverless',
  'Tailwind CSS',
];

/* -------------------------------------------------------------------------- */
/*                                    Main                                    */
/* -------------------------------------------------------------------------- */
export default function SkillsSection(): JSX.Element {
  return (
    <Section>
      <SectionTitle title="Skills" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <SkillChip key={skill} skill={skill} />
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
function SkillChip({ skill }: { skill: string }): JSX.Element {
  return (
    <div className="text-center p-4 bg-gray-700 rounded-lg">
      <span className="text-2xl font-bold">{skill}</span>
    </div>
  );
}

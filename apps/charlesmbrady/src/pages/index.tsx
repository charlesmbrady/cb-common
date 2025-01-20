import { UiTailwind } from '@cb-common/ui-tailwind';
import styles from './index.module.css';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

  const YearsOfExperience = () => {
    const startDate = new Date('2017-01-01');
    const currentDate = new Date();
    const yearsOfExperience =
      currentDate.getFullYear() - startDate.getFullYear();
    return <>{yearsOfExperience}</>;
  };

  return (
    <>
      <h6>Building Innovative Solutions, One Line of Code at a Time</h6>
      <p>
        Hi, I’m Charles Brady—a Senior Fullstack Engineer with over{' '}
        <YearsOfExperience /> years of experience in understanding user pain
        points, while designing and delivering high-impact software solutions.
      </p>
      <p>
        I specialize in building scalable, maintainable, and performant web
        applications using modern technologies. I have a passion for learning
        and sharing knowledge with others. I also have an obsession for
        automation whether it be automated testing, CI/CD, or infrastructure as
        code.
      </p>
      <p>
        Welcome to my digital home base! Here, I bring together my passion for
        crafting cutting-edge web applications and my knack for turning complex
        problems into elegant solutions. I’ve worn many hats—Salesforce
        Administrator, QA Engineer, Software Engineer, and now Senior Fullstack
        Engineer—and each role has sharpened my technical edge and collaborative
        spirit.
      </p>
      <p>
        As you scroll down, you’ll get a glimpse of who I am, the projects I’ve
        poured my heart into, the technologies I use, and how to get in touch.
        Let’s create something remarkable together!
      </p>
    </>
  );
}

export default Index;

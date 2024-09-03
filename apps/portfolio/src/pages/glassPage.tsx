export default function GlassPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-purple-700 to-pink-700 text-white font-inter">
      {/* Navigation with Enhanced Glassmorphism */}
      <nav className="bg-white bg-opacity-30 backdrop-blur-xl border border-white/40 py-4 shadow-2xl">
        <div className="container max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center">
          <div className="text-2xl font-bold">YourName.dev</div>
          <ul className="flex space-x-6">
            <li>
              <a href="#about" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#projects" className="hover:underline">
                Projects
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          Hi, I'm <span className="text-indigo-300">Your Name</span>
        </h1>
        <p className="text-2xl md:text-3xl font-light mb-8">
          Full-stack Developer | Tech Enthusiast | Problem Solver
        </p>
        <a
          href="#projects"
          className="px-8 py-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
        >
          View My Work
        </a>
      </section>

      {/* About Section with Enhanced Glassmorphism */}
      <section id="about" className="py-20">
        <div className="container max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <img
            src={'/chuckpic.png'}
            alt="Your Name"
            className="rounded-full w-64 h-64 mx-auto shadow-2xl border-4 border-white/40"
          />
          <div className="flex flex-col justify-center bg-white bg-opacity-30 backdrop-blur-xl border border-white/40 p-10 rounded-2xl shadow-2xl">
            <h2 className="text-5xl font-bold mb-4">About Me</h2>
            <p className="text-xl text-gray-200">
              I’m a passionate developer with a love for creating intuitive,
              dynamic user experiences. I have experience in a variety of
              technologies and enjoy learning new skills.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section with Enhanced Glassmorphism */}
      <section id="projects" className="py-20">
        <div className="container max-w-7xl mx-auto px-6 sm:px-8">
          <h2 className="text-5xl font-bold text-center mb-12">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white bg-opacity-30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-8">
              <h3 className="text-3xl font-bold mb-4">Project 1</h3>
              <p className="text-gray-200 mb-4">
                Description of the project, technologies used, and key features.
              </p>
              <a
                href="https://github.com/yourusername/project1"
                className="text-indigo-300 hover:underline"
              >
                View on GitHub
              </a>
            </div>
            {/* Repeat the above block for more projects */}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-5xl font-bold mb-8">Contact Me</h2>
          <p className="text-xl text-gray-200 mb-8">
            Feel free to reach out if you're interested in working together or
            just want to connect!
          </p>
          <a
            href="mailto:youremail@example.com"
            className="px-8 py-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Get in Touch
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-gray-500">© 2024 Your Name. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

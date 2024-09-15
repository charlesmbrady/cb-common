// src/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
        {/* Name and Copyright */}
        {/* <p className="text-gray-500 mb-4">
          © {new Date().getFullYear()} Charles. All Rights Reserved.
        </p> */}

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 text-xl">
          <a
            href="https://github.com/charlesmbrady"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-indigo-400 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/charles-brady-8634b114a"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-indigo-400 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:charlesmbrady@gmail.com"
            className="text-gray-500 hover:text-indigo-400 transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}

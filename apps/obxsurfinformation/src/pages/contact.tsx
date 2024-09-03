// pages/contact.tsx
import Head from 'next/head';

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Contact Us - Charlava</title>
        <meta
          name="description"
          content="Get in touch with Charlava to learn more about our Website as a Service offerings."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gray-900 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-2">
            We're here to answer your questions and help you get started with our automated website management services.
          </p>
        </div>
      </header>

      <main className="container mx-auto p-6 flex-grow">
        <section className="my-10">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <form className="bg-white p-6 shadow-lg rounded-lg">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input className="w-full px-3 py-2 border rounded-lg" type="text" id="name" placeholder="Your Name" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input className="w-full px-3 py-2 border rounded-lg" type="email" id="email" placeholder="Your Email" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                id="message"
                rows={5}
                placeholder="Your Message"
              ></textarea>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Send Message</button>
          </form>
        </section>
      </main>

      <footer className="bg-gray-900 text-white p-6 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Charlava. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

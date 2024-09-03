// // pages/index.js
// // import Head from 'next/head';

// export function Home() {
//   return (
//     <div>
//       {/* <Head>
//         <title>Charlava - Website as a Service (WaaS)</title>
//         <meta name="description" content="Charlava offers Website as a Service (WaaS) with automated web development, hosting, and ongoing improvements without the hassle of managing it yourself." />
//         <link rel="icon" href="/favicon.ico" />
//       </Head> */}

//       <header className="bg-gray-900 text-white p-6">
//         <div className="container mx-auto">
//           <h1 className="text-4xl font-bold">Charlava</h1>
//           <p className="mt-2">Website as a Service (WaaS) - Efficient, Automated, and Hassle-Free</p>
//         </div>
//       </header>

//       <main className="container mx-auto p-6">
//         <section className="my-10">
//           <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
//           <p className="mb-4">
//             Charlava provides a fully automated, hands-off approach to managing your website. Our Website as a Service
//             (WaaS) model ensures your site remains optimized, secure, and up-to-date without the need for constant
//             oversight.
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="bg-white p-6 shadow-lg rounded-lg">
//               <h3 className="text-2xl font-bold mb-3">Automated Website Development</h3>
//               <p>
//                 We build and deploy modern, responsive websites using Next.js, ensuring speed and reliability with
//                 minimal manual intervention.
//               </p>
//             </div>
//             <div className="bg-white p-6 shadow-lg rounded-lg">
//               <h3 className="text-2xl font-bold mb-3">Continuous Maintenance & Updates</h3>
//               <p>
//                 Our automated systems handle all updates, security patches, and maintenance tasks, keeping your website
//                 in top shape effortlessly.
//               </p>
//             </div>
//             <div className="bg-white p-6 shadow-lg rounded-lg">
//               <h3 className="text-2xl font-bold mb-3">Automated Analytics & Reporting</h3>
//               <p>
//                 Receive monthly automated reports on website performance, user analytics, and SEO, with no extra effort
//                 required from your side.
//               </p>
//             </div>
//             <div className="bg-white p-6 shadow-lg rounded-lg">
//               <h3 className="text-2xl font-bold mb-3">Scalable Solutions</h3>
//               <p>
//                 Your website grows with your business, with scalable infrastructure that automatically adapts to
//                 increased traffic and demand.
//               </p>
//             </div>
//           </div>
//         </section>

//         <section className="my-10">
//           <h2 className="text-3xl font-bold mb-4">Our Approach</h2>
//           <p className="mb-4">
//             Charlava focuses on providing a streamlined, automated solution for your website needs. Our clients benefit
//             from:
//           </p>
//           <ul className="list-disc list-inside space-y-2">
//             <li>Access to future service upgrades without additional costs.</li>
//             <li>Automated performance and security checks with monthly reports.</li>
//             <li>SEO optimization with no manual adjustments required.</li>
//             <li>A completely hands-off experience—set it and forget it.</li>
//           </ul>
//         </section>

//         <section className="my-10">
//           <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div>
//               <h3 className="text-2xl font-bold mb-3">Hands-Off Management</h3>
//               <p>
//                 With Charlava, everything is automated. From updates to analytics, your website runs smoothly without
//                 requiring your constant attention.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold mb-3">Efficient and Scalable</h3>
//               <p>
//                 Our WaaS model ensures that your website can scale with your business needs, handling traffic spikes and
//                 growth automatically.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold mb-3">Transparent and Predictable Pricing</h3>
//               <p>
//                 Our pricing model is simple and transparent. Pay a monthly fee and get all the benefits of a fully
//                 managed, continuously improving website.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-2xl font-bold mb-3">Automation-Driven Results</h3>
//               <p>
//                 All our services are designed to deliver consistent, reliable results through automation, ensuring your
//                 website remains top-tier without manual input.
//               </p>
//             </div>
//           </div>
//         </section>

//         <section className="my-10">
//           <h2 className="text-3xl font-bold mb-4">Get Started</h2>
//           <p>
//             Ready to simplify your online presence? Contact us today to see how our WaaS model can keep your website
//             performing at its best with minimal effort on your part.
//           </p>
//           <div className="mt-6">
//             <a href="/contact" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
//               Contact Us
//             </a>
//           </div>
//         </section>
//       </main>

//       <footer className="bg-gray-900 text-white p-6">
//         <div className="container mx-auto text-center">
//           <p>&copy; 2024 Charlava. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// // pages/contact.js
// import Head from 'next/head';

// export default function Contact() {
//   return (
//     <div>
//       <Head>
//         <title>Contact Us - Charlava</title>
//         <meta
//           name="description"
//           content="Get in touch with Charlava to learn more about our Website as a Service offerings."
//         />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <header className="bg-gray-900 text-white p-6">
//         <div className="container mx-auto">
//           <h1 className="text-4xl font-bold">Contact Us</h1>
//           <p className="mt-2">
//             We're here to answer your questions and help you get started with our automated website management services.
//           </p>
//         </div>
//       </header>

//       <main className="container mx-auto p-6">
//         <section className="my-10">
//           <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
//           <form className="bg-white p-6 shadow-lg rounded-lg">
//             <div className="mb-4">
//               <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
//                 Name
//               </label>
//               <input className="w-full px-3 py-2 border rounded-lg" type="text" id="name" placeholder="Your Name" />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
//                 Email
//               </label>
//               <input className="w-full px-3 py-2 border rounded-lg" type="email" id="email" placeholder="Your Email" />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 font-bold mb-2" htmlFor="message">
//                 Message
//               </label>
//               {/* <textarea className="w-full px-3 py-2 border rounded-lg" id="message" rows="5" placeholder="Your Message"></textarea> */}
//             </div>
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Send Message</button>
//           </form>
//         </section>
//       </main>

//       <footer className="bg-gray-900 text-white p-6">
//         <div className="container mx-auto text-center">
//           <p>&copy; 2024 Charlava. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

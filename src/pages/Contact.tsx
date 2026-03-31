import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContactPage = () => (
  <div className="bg-yozora min-h-screen">
    <Navbar />
    <section className="pt-32 pb-20 px-6 lg:px-12 max-w-5xl mx-auto">
      <h1 className="font-heading text-gold tracking-[0.2em] text-4xl md:text-5xl text-center mb-16">Contact</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="font-heading text-gold tracking-[0.15em] text-xl mb-6">Get in Touch</h2>
          <p className="text-ivory text-sm opacity-70 mb-8 leading-relaxed">
            We'd love to hear from you. Whether you have a question about our platform, pricing, or anything else, our team is ready to help.
          </p>
          <div className="space-y-4">
            <div>
              <p className="small-caps-gold text-[10px] mb-1">Email</p>
              <p className="text-ivory text-sm opacity-70">hello@yozoralounge.com</p>
            </div>
            <div>
              <p className="small-caps-gold text-[10px] mb-1">Response Time</p>
              <p className="text-ivory text-sm opacity-70">Within 24 hours</p>
            </div>
          </div>
        </div>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="small-caps-gold text-[10px] block mb-2">Name</label>
            <input type="text" className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="small-caps-gold text-[10px] block mb-2">Email</label>
            <input type="email" className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="small-caps-gold text-[10px] block mb-2">Message</label>
            <textarea rows={6} className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none focus:border-primary resize-none transition-colors" />
          </div>
          <button type="submit" className="btn-gold-solid w-full">Send Message</button>
        </form>
      </div>
    </section>
    <Footer />
  </div>
);

export default ContactPage;

export default function Contact() {
  return (
    <section className="max-w-xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-card text-foreground" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-card text-foreground" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea className="w-full px-4 py-2 border border-gray-300 rounded-md bg-card text-foreground" rows="5" required></textarea>
        </div>
        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Send</button>
      </form>
    </section>
  );
}

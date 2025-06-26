export default function Contact() {
  return (
    <section className="max-w-xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold mb-8 tracking-tight">Contact Us</h2>
      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
            Message
          </label>
          <textarea
            id="message"
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition shadow-sm"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}

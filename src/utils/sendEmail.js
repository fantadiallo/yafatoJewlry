import emailjs from "@emailjs/browser";

emailjs.send(
  "service_u2mmon2",    // your Service ID
  "template_znscq7a",   // your Template ID
  {
    name: "Fatou",              // maps to {{name}}
    email: "fatou@example.com", // maps to {{email}}
    subject: "Order Inquiry",   // maps to {{subject}}
    message: "Hey 👋",           // maps to {{message}}
    time: new Date().toLocaleString() // maps to {{time}} if you use it
  },
  {
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  }
).then(
  (res) => {
    console.log("SUCCESS!", res.status, res.text);
  },
  (err) => {
    console.error("FAILED...", err);
  }
);

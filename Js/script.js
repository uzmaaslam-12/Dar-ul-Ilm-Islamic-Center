// ==============================
// SUPABASE CONFIG
// ==============================
const supabaseUrl = "https://uqbcpmnsizhoukhrujqp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxYmNwbW5zaXpob3VraHJ1anFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMjEzOTcsImV4cCI6MjA5MDU5NzM5N30.jV0DHd-UPszYDd_fCqP2GEr-Pk_F9sGJ-psVnmqi6SQ";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);



document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById('enrollForm');
  const ageSelect = document.getElementById('age');
  const countrySelect = document.getElementById('country');

  // Populate age dropdown
  for (let i = 5; i <= 60; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    ageSelect.appendChild(option);
  }

  // Populate country dropdown
  const countries = ["Saudi Arabia", "United States", "United Kingdom", "UAE", "Canada", "Australia", "Pakistan", "Other"];
  countries.forEach(c => {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    countrySelect.appendChild(option);
  });

  // WhatsApp input validation
  const whatsappInput = document.getElementById('whatsapp');
  whatsappInput.addEventListener('input', () => {
    whatsappInput.value = whatsappInput.value.replace(/[^0-9+]/g, '');
  });

  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentName = document.getElementById('studentName').value.trim();
    const email = document.getElementById('email').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const language = document.getElementById('language').value;
    const country = document.getElementById('country').value;
    const course = document.getElementById('course').value;
    const classPlan = document.getElementById('classPlan').value;

    // Validation
    if (!studentName || !email || !whatsapp || !age || !language || !country || !course || !classPlan) {
      Swal.fire('⚠️ Missing Fields', 'Please fill all required fields', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire('⚠️ Invalid Email', 'Please enter a valid email', 'warning');
      return;
    }

    if (!whatsapp.match(/^\+?[0-9]{8,15}$/)) {
      Swal.fire('⚠️ Invalid WhatsApp', 'Enter a valid WhatsApp number with country code', 'warning');
      return;
    }

    if (age < 5 || age > 60) {
      Swal.fire('⚠️ Invalid Age', 'Please select age between 5 and 60', 'warning');
      return;
    }

    const formData = {
      student_name: studentName,
      email: email,
      whatsapp: whatsapp,
      age: age,
      language: language,
      country: country,
      course: course,
      class_plan: classPlan
    };

    try {
      // --- Duplicate Email Check ---
      const { data: existingEmails, error: fetchError } = await supabaseClient
        .from('registrations')
        .select('email')
        .eq('email', email)
        .limit(1);

      if (fetchError) throw fetchError;

      if (existingEmails.length > 0) {
        Swal.fire('⚠️ Duplicate Email', 'This email is already registered.', 'warning');
        return;
      }

      // --- Insert into Supabase ---
      const { data, error } = await supabaseClient
        .from('registrations')
        .insert([formData]);

      if (error) {
        console.error("Supabase Error:", error);
        Swal.fire('❌ Error', error.message, 'error');
        return;
      }

      // --- Success Notification ---
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        html: `<b>${studentName}</b> has been registered for <b>${course}</b>.<br>We will contact you soon!`,
        confirmButtonColor: '#0b350e'
      }).then(() => {
        form.reset();
        ageSelect.value = "";
        countrySelect.value = "";
      });

    } catch (err) {
      console.log("Unexpected Error:", err);
      Swal.fire('❌ Error', err.message || 'Something went wrong!', 'error');
    }
  });
});




// ============== FAQS ================//

function filterFAQs() {
    const input = document.getElementById('faqSearch').value.toLowerCase();
    const items = document.querySelectorAll('#faqAccordion .accordion-item');

    items.forEach(item => {
        const buttonText = item.querySelector('.accordion-button').textContent.toLowerCase();
        const bodyText = item.querySelector('.accordion-body').textContent.toLowerCase();

        if (buttonText.includes(input) || bodyText.includes(input)) {
            item.style.display = ""; // show
        } else {
            item.style.display = "none"; // hide
        }
    });
}
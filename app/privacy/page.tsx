import Header from '@/components/header'

export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto p-24 pt-4">
      <Header />
      <h2 className="my-8 text-xl font-bold">Privacy Policy</h2>
      <section>
        This privacy policy governs the collection, use, and disclosure of personal information by our website, which
        makes a training log and stats based on user&apos;s activities fetched from Strava. Our website is committed to
        protecting your privacy and ensuring that your personal information is kept confidential and secure. We respect
        your right to privacy and want you to feel comfortable using our website.
      </section>
      <h3 className="my-4 font-bold">1. Collection of Personal Information</h3>
      <section>
        Our website collects personal information from users who register with us. This information includes your name
        and other details that are required for registration. Additionally, our website may collect your activity data
        from Strava, which includes your activities, stats, and other activity-related information.
      </section>
      <h3 className="my-4 font-bold">2. Use of Personal Information</h3>
      <section>
        We use the personal information collected from you to provide you with the services offered on our website. This
        includes generating training logs and stats based on your activity data from Strava.
      </section>

      <h3 className="my-4 font-bold">3. Disclosure of Personal Information</h3>
      <section>
        Our website will never share your personal information with third parties, except as required by law or to
        comply with a court order or legal process. We will never use your personal information for any purpose other
        than those stated in this privacy policy.
      </section>

      <h3 className="my-4 font-bold">4. Security of Personal Information</h3>

      <section>
        We take the security of your personal information seriously and have implemented technical and organizational
        measures to protect your information from unauthorized access, disclosure, alteration, or destruction. We use
        industry-standard encryption technologies to safeguard your data and maintain appropriate security measures to
        protect your personal information.
      </section>

      <h3 className="my-4 font-bold">5. Children&apos;s Privacy</h3>

      <section>
        Our website is not intended for children under the age of 13, and we do not knowingly collect personal
        information from children under the age of 13.
      </section>

      <h3 className="my-4 font-bold">6. Changes to the Privacy Policy</h3>

      <section>
        We may update this privacy policy from time to time. We will notify you of any changes by posting the new
        privacy policy on our website. You should review this privacy policy periodically for any changes.
      </section>

      <h3 className="my-4 font-bold">7. Contact Information</h3>
      <section>
        If you have any questions or concerns about this privacy policy, please contact us at [insert contact
        information].
      </section>
    </main>
  )
}

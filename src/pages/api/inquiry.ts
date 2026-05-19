import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);

  if (!body || !body.email) {
    return new Response(JSON.stringify({ error: 'Missing email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name = '', phone = '', email, arrive, depart, guests, suite } = body;

  // Validate check-in is at least tomorrow
  if (arrive) {
    const arriveDate = new Date(arrive + 'T00:00:00');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    if (arriveDate < tomorrow) {
      return new Response(JSON.stringify({ error: 'Check-in must be at least tomorrow.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Validate minimum 3 nights
  if (arrive && depart) {
    const nights = (new Date(depart + 'T00:00:00').getTime() - new Date(arrive + 'T00:00:00').getTime()) / 86400000;
    if (nights < 3) {
      return new Response(JSON.stringify({ error: 'Minimum stay is 3 nights.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to     = import.meta.env.INQUIRY_TO     || 'heroninn@gmail.com';
  const from   = import.meta.env.RESEND_FROM    || 'Great Heron Inn <noreply@heroninn.com>';

  if (!apiKey) {
    // Dev fallback: log to console, return success
    console.log('[inquiry]', { name, phone, email, arrive, depart, guests, suite });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Availability Inquiry — ${arrive} to ${depart} (${suite})`,
      html: `
        <p><strong>Name:</strong> ${name || '(not provided)'}</p>
        <p><strong>Phone:</strong> ${phone || '(not provided)'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Arrive:</strong> ${arrive}</p>
        <p><strong>Depart:</strong> ${depart}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Suite:</strong> ${suite}</p>
      `,
    });

    // Auto-reply to guest
    if (email) {
      await resend.emails.send({
        from,
        to: email,
        subject: 'We received your inquiry — Great Heron Inn',
        html: `
          <p>Hi${name ? ' ' + name : ''},</p>
          <p>Thank you for your interest in the Great Heron Inn! We've received your availability request for <strong>${arrive} – ${depart}</strong> (${guests}, ${suite}).</p>
          <p>We answer every inquiry personally and will get back to you within a few hours. You can also reach us directly at <a href="tel:+17275952589">(727) 595-2589</a>.</p>
          <p>— The Great Heron Inn family</p>
          <p style="color:#666;font-size:12px">68 Gulf Boulevard · Indian Rocks Beach, FL 33785</p>
        `,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[inquiry] Resend error:', err);
    return new Response(JSON.stringify({ error: 'Send failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

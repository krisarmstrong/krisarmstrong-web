import testimonialsData from '../content/testimonials/testimonials.json';

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  avatar: string;
  company?: string;
  position: string;
}

export default function Testimonials() {
  const testimonials = testimonialsData as Testimonial[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
      {testimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className="bg-surface-raised border border-surface-border rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center mb-4">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <span className="font-semibold block">{testimonial.name}</span>
              <span className="text-sm text-text-muted">{testimonial.position}</span>
            </div>
          </div>
          <blockquote className="text-lg italic text-text-accent">"{testimonial.quote}"</blockquote>
        </div>
      ))}
    </div>
  );
}

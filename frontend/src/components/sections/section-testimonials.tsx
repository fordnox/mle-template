import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx"
import Squares from "@/components/effects/squares.tsx"

const testimonials = [
  {
    name: "Jen C.",
    role: "Senior Backend Engineer",
    company: "Renzee",
    content: "SchemaHub transformed how we design our microservices. We love ability to iterate with versions of database until the team agrees with the final version.",
    initials: "SC",
  },
  {
    name: "Marcus R.",
    role: "Tech Lead",
    company: "SomiumTech",
    content: "This is now my favourite way of creating API endpoints for my pet projects. I was not familiar with DBML format, but was able to iterate quickly until my API was ready.",
    initials: "MR",
  },
  {
    name: "Emily B.",
    role: "Full Stack Developer",
    company: "Yukiko",
    content: "I have tried to vibe code without schema first approach and with. The output of the generated code is one shot perfect. The visual editor is intuitive and the AI suggestions are surprisingly accurate.",
    initials: "EW",
  },
]

export function SectionTestimonials() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Squares
          direction="down"
          speed={0.3}
          borderColor="hsl(var(--border))"
          hoverFillColor="hsl(var(--muted))"
          squareSize={20}
        />
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Written by Developers</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              This is what we have received in our Feedback form
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col justify-between">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`/placeholder-user-${index + 1}.jpg`} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold leading-none">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

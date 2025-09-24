import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LucideIcon } from "lucide-react";
import { CalendarClock, ChevronRight, Clock, MapPin, ShieldCheck, Sparkles, Star, Users2 } from "lucide-react";

const heroStats = [
  { label: "Venues onboarded", value: "180+" },
  { label: "Experiences scheduled", value: "12k+" },
  { label: "Satisfaction score", value: "4.9/5" },
];

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  highlight: string;
};

const features: Feature[] = [
  {
    title: "hello",
    description: "Instantly view open slots, resource conflicts, and blackout periods across every campus location.",
    icon: CalendarClock,
    highlight: "Live synced with facilities & Google Workspace",
  },
  {
    title: "Smart assistant workflows",
    description: "Automate service requests, vendor coordination, and notifications with AI-generated playbooks.",
    icon: Sparkles,
    highlight: "Save up to 6 hours per event",
  },
  {
    title: "Collaborative timelines",
    description: "Keep marketing, operations, and venue teams aligned with shared tasks, approvals, and status updates.",
    icon: Users2,
    highlight: "Stakeholder visibility in one place",
  },
  {
    title: "Built-in compliance",
    description: "Stay audit-ready with digital checklists, access control, and automated contract tracking.",
    icon: ShieldCheck,
    highlight: "Meets ISO 27001 standards",
  },
];

type CollectionItem = {
  title: string;
  location: string;
  capacity: string;
  highlight: string;
};

type Collection = {
  value: string;
  label: string;
  description: string;
  items: CollectionItem[];
};

const curatedCollections: Collection[] = [
  {
    value: "meetings",
    label: "Team meetings",
    description: "Premium spaces engineered for agile squads, leadership huddles, and hybrid collaboration.",
    items: [
      {
        title: "Skyline Collaboration Hub",
        location: "FPT Tower - District 1",
        capacity: "Up to 18 guests",
        highlight: "AI-enabled whiteboard - Hybrid-ready",
      },
      {
        title: "Innovation Studio Alpha",
        location: "F-Ville 2 - Ha Noi",
        capacity: "Up to 26 guests",
        highlight: "Modular seating - Rapid prototyping gear",
      },
    ],
  },
  {
    value: "events",
    label: "Signature events",
    description: "Curated stage designs, lighting, and concierge support for launch nights and C-level summits.",
    items: [
      {
        title: "Aurora Convention Hall",
        location: "FPT Complex - Da Nang",
        capacity: "350 guests",
        highlight: "360 degrees LED wall - Broadcast control room",
      },
      {
        title: "Riverfront Pavilion",
        location: "Saigon South Campus",
        capacity: "220 guests",
        highlight: "Open-air terrace - Customizable mood lighting",
      },
    ],
  },
  {
    value: "learning",
    label: "Learning journeys",
    description: "Immersive classrooms and labs for certification tracks, community workshops, and demo days.",
    items: [
      {
        title: "Future Skills Lab",
        location: "FPT University - HCMC",
        capacity: "32 learners",
        highlight: "VR stations - Instructor concierge",
      },
      {
        title: "Discovery Workshop Loft",
        location: "F-Ville - Ha Noi",
        capacity: "40 learners",
        highlight: "Moveable walls - Catering integration",
      },
    ],
  },
];

const testimonials = [
  {
    name: "Lan Pham",
    role: "Head of Workforce Ops - FPT Software",
    quote:
      "We centralised booking across three campuses and approvals now take minutes instead of days. The built-in playbooks keep every department aligned.",
    initials: "LP",
    metric: "32% faster approvals",
  },
  {
    name: "Bao Nguyen",
    role: "Experience Designer - Green Horizon Events",
    quote:
      "EXE Booking gives us a single command centre. From catering to access control, every vendor knows exactly when to show up and what to deliver.",
    initials: "BN",
    metric: "4.8 satisfaction rating",
  },
];

const partnerLogos = ["FPT University", "Green Horizon", "Sao Khue Hall", "Aurora Group", "Da Nang Next"];

const heroUpdates = [
  {
    title: "Catering finalised",
    detail: "Chef Minh's plant-based menu confirmed for 120 attendees.",
  },
  {
    title: "Hybrid tech check passed",
    detail: "All rooms synced with Teams Rooms kits and moderator support.",
  },
  {
    title: "VIP logistics ready",
    detail: "Security clearance issued and airport transfers scheduled.",
  },
];

export default function HomePage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />
      <header className="border-border/60 bg-background/80 border-b backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold tracking-tight uppercase">
              EX
            </div>
            <div className="flex flex-col">
              <span className="text-lg leading-none font-semibold tracking-tight">EXE Booking</span>
              <span className="text-muted-foreground text-sm">Campus experience platform</span>
            </div>
          </div>
          <nav className="text-muted-foreground hidden items-center gap-6 text-sm md:flex">
            <a className="hover:text-foreground transition-colors" href="#features">
              Features
            </a>
            <a className="hover:text-foreground transition-colors" href="#collections">
              Collections
            </a>
            <a className="hover:text-foreground transition-colors" href="#stories">
              Stories
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
            <Button size="sm">Book a demo</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative px-6 py-16 md:py-24">
          <div className="from-primary/10 absolute inset-0 -z-10 bg-gradient-to-br via-transparent to-transparent" aria-hidden="true" />
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
              <div className="space-y-8">
                <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary w-fit">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Release 2025.1 - Experience OS
                </Badge>
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    Orchestrate unforgettable campus experiences with ease
                  </h1>
                  <p className="text-muted-foreground max-w-xl text-lg">
                    Bring venues, services, and people together in one beautifully coordinated workspace. EXE Booking automates the busywork so your
                    teams can focus on what matters most: creating meaningful moments.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="shadow-sm">
                    Explore the platform
                  </Button>
                  <Button size="lg" variant="ghost" className="border-border/70 bg-background/80 hover:border-border border backdrop-blur transition">
                    See live availability
                  </Button>
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="border-border/70 bg-background/70 rounded-xl border p-5 shadow-sm backdrop-blur">
                      <p className="text-3xl font-semibold">{stat.value}</p>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Card className="border-border/70 bg-background/80 backdrop-blur">
                <CardHeader className="space-y-3">
                  <Badge variant="secondary" className="bg-secondary/70 text-secondary-foreground w-fit">
                    Upcoming experience
                  </Badge>
                  <CardTitle className="text-2xl">Future of Learning Summit</CardTitle>
                  <CardDescription>All approvals captured and synced.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-muted-foreground space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="text-primary h-4 w-4" />
                      <span>Friday - Feb 14 - 09:30 - 16:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="text-primary h-4 w-4" />
                      <span>Innovation Theater - FPT Campus Da Nang</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users2 className="text-primary h-4 w-4" />
                      <span>120 confirmed attendees</span>
                    </div>
                  </div>
                  <div className="border-border/70 bg-muted/40 space-y-3 rounded-lg border border-dashed p-4 text-sm">
                    {heroUpdates.map((update) => (
                      <div key={update.title} className="flex items-start gap-3 text-left">
                        <div className="bg-primary mt-1 h-2.5 w-2.5 rounded-full" />
                        <div>
                          <p className="text-foreground font-medium">{update.title}</p>
                          <p className="text-muted-foreground">{update.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-border/60 justify-between border-t pt-6">
                  <div>
                    <p className="text-foreground text-sm font-medium">All logistics confirmed</p>
                    <p className="text-muted-foreground text-xs">Catering, security, and equipment synced</p>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View playbook
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="text-muted-foreground mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 text-sm">
              <span className="text-foreground font-medium">Trusted by leading campuses</span>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 opacity-70">
                {partnerLogos.map((partner) => (
                  <span key={partner} className="tracking-wide uppercase">
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Badge variant="outline" className="border-border/60 text-muted-foreground">
                Platform pillars
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Everything you need to run campus experiences end-to-end
              </h2>
              <p className="text-muted-foreground mt-3 text-base">
                Every workflow is designed for enterprise teams who deliver hospitality-grade experiences across multiple locations.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border/70 h-full transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="bg-primary/10 text-primary rounded-lg p-3">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-sm leading-6">{feature.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="border-border/60 border-t border-dashed pt-4">
                    <p className="text-foreground text-sm font-medium">{feature.highlight}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="collections" className="bg-muted/20 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <Badge variant="outline" className="border-border/60 text-muted-foreground">
                Curated collections
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Choose experiences tailored to your audience</h2>
              <p className="text-muted-foreground mt-3 text-base">
                Tap into playbooks backed by real data. Each collection bundles spaces, services, and insights for the outcomes you care about.
              </p>
            </div>
            <Tabs defaultValue={curatedCollections[0].value} className="w-full">
              <div className="flex flex-col gap-8 lg:flex-row">
                <TabsList className="flex w-full flex-wrap justify-start gap-2 bg-transparent p-0 lg:w-60 lg:flex-col">
                  {curatedCollections.map((collection) => (
                    <TabsTrigger
                      key={collection.value}
                      value={collection.value}
                      className="data-[state=active]:border-border data-[state=active]:bg-background w-full justify-start rounded-lg border border-transparent px-4 py-3 text-left text-sm font-medium"
                    >
                      {collection.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="flex-1">
                  {curatedCollections.map((collection) => (
                    <TabsContent key={collection.value} value={collection.value} className="space-y-6">
                      <div className="border-border/60 bg-background/80 text-muted-foreground rounded-xl border border-dashed p-6 text-sm shadow-sm">
                        {collection.description}
                      </div>
                      <div className="grid gap-6 md:grid-cols-2">
                        {collection.items.map((item) => (
                          <Card key={item.title} className="border-border/70 h-full transition-shadow hover:shadow-md">
                            <CardHeader className="space-y-3">
                              <CardTitle className="text-xl">{item.title}</CardTitle>
                              <CardDescription className="text-muted-foreground flex items-center gap-2 text-sm">
                                <MapPin className="text-primary h-4 w-4" />
                                {item.location}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="text-muted-foreground space-y-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="text-primary h-4 w-4" />
                                {item.capacity}
                              </div>
                              <div className="border-border/60 bg-muted/30 text-foreground rounded-lg border border-dashed p-3">{item.highlight}</div>
                            </CardContent>
                            <CardFooter className="border-border/60 border-t pt-4">
                              <Button variant="ghost" size="sm" className="gap-1">
                                View blueprint
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </div>
            </Tabs>
          </div>
        </section>
        <section id="stories" className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Badge variant="outline" className="border-border/60 text-muted-foreground">
                Customer stories
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Teams that design with confidence</h2>
              <p className="text-muted-foreground mt-3 text-base">
                See how operations, marketing, and event specialists across Vietnam elevate every experience with EXE Booking.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="border-border/70 h-full">
                  <CardContent className="space-y-6 pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-base font-semibold">{testimonial.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="text-primary flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star key={index} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-foreground font-medium">{testimonial.name}</p>
                        <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <blockquote className="text-base leading-relaxed font-medium">"{testimonial.quote}"</blockquote>
                  </CardContent>
                  <CardFooter className="border-border/60 border-t pt-4">
                    <p className="text-primary text-sm font-medium">{testimonial.metric}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-6xl">
            <Card className="bg-primary text-primary-foreground relative overflow-hidden border-none shadow-lg">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(255,255,255,0.18),_transparent_55%)]"
                aria-hidden="true"
              />
              <CardContent className="relative space-y-6 px-6 py-12 md:px-12">
                <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Ready to launch your next signature experience?</h2>
                <p className="text-primary-foreground/80 max-w-2xl text-base">
                  Partner with our campus specialists to transform your onboarding, innovation sprints, and flagship events. We will tailor EXE
                  Booking to match your processes in under two weeks.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" variant="secondary" className="text-primary">
                    Talk to an expert
                  </Button>
                  <Button size="lg" variant="ghost" className="border-primary-foreground/40 text-primary-foreground border bg-transparent">
                    Download the playbook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="border-border/60 border-t py-8">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span>(c) {currentYear} EXE Booking. Crafted for campus experiences.</span>
          <div className="flex flex-wrap gap-4">
            <a className="hover:text-foreground transition-colors" href="/">
              Privacy
            </a>
            <a className="hover:text-foreground transition-colors" href="/">
              Security
            </a>
            <a className="hover:text-foreground transition-colors" href="/">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

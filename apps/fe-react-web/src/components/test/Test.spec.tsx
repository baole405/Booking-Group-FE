import { render, screen } from "@testing-library/react";
import { GaugeIcon, GlobeIcon } from "lucide-react";
import { vi } from "vitest";

import { NavMain } from "../nav-main";
import { SidebarProvider } from "../ui/sidebar";

import "@testing-library/jest-dom/vitest";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("max-width"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("NavMain", () => {
  it("renders quick actions and the provided navigation entries", () => {
    const items = [
      { title: "Dashboard", url: "/dashboard", icon: GaugeIcon },
      { title: "Global reports", url: "/reports", icon: GlobeIcon },
      { title: "Team calendar", url: "/calendar" },
    ];

    render(
      <SidebarProvider>
        <NavMain items={items} />
      </SidebarProvider>,
    );

    expect(screen.getByRole("button", { name: /quick create/i })).toBeInTheDocument();
    expect(screen.getByText(/inbox/i)).toBeInTheDocument();

    items.forEach((item) => {
      const navButton = screen.getByRole("button", { name: new RegExp(item.title, "i") });
      expect(navButton).toBeInTheDocument();

      if (item.icon) {
        expect(navButton.querySelector("svg")).not.toBeNull();
      }
    });
  });
});

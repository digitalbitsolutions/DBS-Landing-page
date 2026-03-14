import { createElement } from "react";

import {
  Bot,
  BriefcaseBusiness,
  Code2,
  Globe,
  LayoutTemplate,
  Rocket,
  type LucideIcon,
  Workflow,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  globe: Globe,
  "code-2": Code2,
  bot: Bot,
  rocket: Rocket,
  workflow: Workflow,
  briefcase: BriefcaseBusiness,
  layout: LayoutTemplate,
};

export function getServiceIcon(name: string) {
  return iconMap[name] ?? BriefcaseBusiness;
}

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? BriefcaseBusiness;
  return createElement(Icon, { className });
}

export const availableServiceIcons = Object.keys(iconMap);

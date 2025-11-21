import type React from "react";

export type Item = {
    name: string;
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    path: string;
}

export type Box = {
    children: React.ReactNode;
    className?: string;
}

export type Card = {
    title: string;
    value: string;
    profile: string;
    icon: string;
    percent: string;
    label: string;
}
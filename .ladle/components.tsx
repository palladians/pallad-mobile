import type { GlobalProvider } from "@ladle/react";
import { Providers } from "../src/components/providers";
import "../src/global.css";
import React from "react";

export const Provider: GlobalProvider = ({ children }) => (
	<>
		<script src="https://cdn.tailwindcss.com" />
		<Providers>{children}</Providers>
	</>
);

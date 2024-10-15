import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useVault } from "./vault";

const mockedKeyAgent = {
	id: "24ad50c2-ddaf-4eec-856d-f201f05cfad1",
	type: "hw" as never,
	name: "Test",
	vendor: "ledger" as never,
	publicKey: "test",
	connectivity: "ble" as never,
	derivationPath: "m/1",
};

describe("Vault", () => {
	it("initializes vault", () => {
		const { result } = renderHook(() => useVault());
		expect(result.current.keyAgents).toEqual([]);
	});
	it("adds a key agent", () => {
		const { result } = renderHook(() => useVault());
		act(() => {
			result.current.addKeyAgent(mockedKeyAgent);
		});
		expect(result.current.keyAgents.length).toEqual(1);
	});
	it("removes a key agent", () => {
		const { result } = renderHook(() => useVault());
		act(() => {
			result.current.addKeyAgent(mockedKeyAgent);
		});
		act(() => {
			result.current.removeKeyAgent(mockedKeyAgent.id);
		});
		expect(result.current.keyAgents.length).toEqual(0);
	});
	it("gets a key agent", () => {
		const { result } = renderHook(() => useVault());
		act(() => {
			result.current.addKeyAgent(mockedKeyAgent);
		});
		expect(result.current.getKeyAgent(mockedKeyAgent.id)).toEqual(
			mockedKeyAgent,
		);
	});
});

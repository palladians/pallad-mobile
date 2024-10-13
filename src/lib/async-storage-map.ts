import AsyncStorage from "@react-native-async-storage/async-storage";

export class AsyncStorageMapAdapter<K extends string, V> {
	private prefix: string;

	constructor(prefix = "") {
		this.prefix = prefix;
	}

	private getKey(key: K): string {
		return `${this.prefix}${key}`;
	}

	async set(key: K, value: V): Promise<void> {
		const storageKey = this.getKey(key);
		const serializedValue = JSON.stringify(value);
		await AsyncStorage.setItem(storageKey, serializedValue);
	}

	async get(key: K): Promise<V | undefined> {
		const storageKey = this.getKey(key);
		const serializedValue = await AsyncStorage.getItem(storageKey);
		if (serializedValue === null) {
			return undefined;
		}
		return JSON.parse(serializedValue) as V;
	}

	async delete(key: K): Promise<boolean> {
		const storageKey = this.getKey(key);
		const existingValue = await AsyncStorage.getItem(storageKey);
		if (existingValue === null) {
			return false;
		}
		await AsyncStorage.removeItem(storageKey);
		return true;
	}

	async has(key: K): Promise<boolean> {
		const storageKey = this.getKey(key);
		const value = await AsyncStorage.getItem(storageKey);
		return value !== null;
	}

	async clear(): Promise<void> {
		const allKeys = await AsyncStorage.getAllKeys();
		const keysToRemove = allKeys.filter((key) => key.startsWith(this.prefix));
		await AsyncStorage.multiRemove(keysToRemove);
	}

	async size(): Promise<number> {
		const allKeys = await AsyncStorage.getAllKeys();
		return allKeys.filter((key) => key.startsWith(this.prefix)).length;
	}
}

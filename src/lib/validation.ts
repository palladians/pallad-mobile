import { z } from "zod";

export const SendDelegationSchema = z.object({
	nonce: z.coerce.string(),
	memo: z.string().optional(),
	validUntil: z.coerce.string().optional(),
	fee: z.coerce.string(),
	to: z.string(),
	from: z.string(),
});

export const SendPaymentSchema = SendDelegationSchema.extend({
	amount: z.coerce.string(),
});

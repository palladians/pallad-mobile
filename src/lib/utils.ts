import dayjs from "dayjs";
import { P, match } from "ts-pattern";

interface TruncateProps {
	value: string;
	firstCharCount?: number;
	endCharCount?: number;
	dotCount?: number;
}

export const truncateString = ({
	value,
	firstCharCount = value.length,
	endCharCount = 0,
	dotCount = 3,
}: TruncateProps) => {
	const shouldTruncate = value.length > firstCharCount + endCharCount;
	if (!shouldTruncate) return value;

	const firstPortion = value.slice(0, firstCharCount);
	const endPortion = value.slice(-endCharCount);
	const dots = ".".repeat(dotCount);

	return `${firstPortion}${dots}${endPortion}`;
};

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const dateFromNow = (dateTime: string) => {
	const now = dayjs();
	const date = dayjs(dateTime);
	const diffDays = now.diff(date, "days");
	return match(diffDays)
		.with(P.number.lt(2), () => date.fromNow())
		.with(P.number.lt(366), () => date.format("MMM DD"))
		.otherwise(() => date.format("MMM DD, YYYY"));
};

import {
	Toast,
	ToastDescription,
	ToastTitle,
	useToast as useGluestackToast,
} from "@/components/ui/toast";

export const useToast = () => {
	const toast = useGluestackToast();
	const showToast = ({
		title,
		description,
	}: {
		title: string;
		description: string;
	}) => {
		const newId = String(Math.random());
		toast.show({
			id: newId,
			placement: "bottom",
			duration: 3000,
			render: ({ id }) => {
				const uniqueToastId = `toast-${id}`;
				return (
					<Toast nativeID={uniqueToastId} action="muted" variant="solid">
						<ToastTitle>{title}</ToastTitle>
						<ToastDescription>{description}</ToastDescription>
					</Toast>
				);
			},
		});
	};
	return {
		showToast,
	};
};

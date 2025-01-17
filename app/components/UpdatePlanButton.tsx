import type { StripePlan } from '~/services/stripe/stripe-plans'
import { getValueFromStripePlans } from '~/services/stripe/stripe-plans'
import { useFetcher } from '@remix-run/react'

type ComponentProps = {
	planId: StripePlan['planId']
	purchasedPlanId: StripePlan['planId']
}

export const UpdatePlanButton = ({
	planId,
	purchasedPlanId,
}: ComponentProps) => {
	const fetcher = useFetcher()
	const isLoading = fetcher.state !== 'idle'

	const stripePlanName = getValueFromStripePlans(planId, 'planName')
	const stripePlanPriceAmount = getValueFromStripePlans(
		planId,
		'planPriceAmount',
	)
	const purchasedPlanPriceAmount = getValueFromStripePlans(
		purchasedPlanId,
		'planPriceAmount',
	)

	const buttonBackgroundClassName = () => {
		switch (stripePlanName) {
			case 'Basic':
				return 'bg-green-700 hover:bg-green-500'
			case 'Creative':
				return 'bg-sky-700 hover:bg-sky-500'
			case 'PRO':
				return 'bg-purple-700 hover:bg-purple-500'
		}
	}

	if (!stripePlanName || !stripePlanPriceAmount || !purchasedPlanPriceAmount)
		return null

	/**
	 * Returns current plan button.
	 */
	if (stripePlanPriceAmount === purchasedPlanPriceAmount) {
		return (
			<button
				className={`${buttonBackgroundClassName()} flex h-9 flex-row items-center justify-center rounded-xl
				px-12 text-base font-bold text-white transition hover:scale-105 active:scale-100`}>
				<span>Curent Plan</span>
			</button>
		)
	}

	/**
	 * As button `value`, we'll provide newly desired `planId`.
	 */
	return (
		<fetcher.Form
			action="/resources/stripe/update-subscription-plan"
			method="post">
			<button
				name="newPlanId"
				value={planId}
				className={`${buttonBackgroundClassName()} flex h-9 flex-row items-center justify-center rounded-xl
				px-12 text-base font-bold text-white opacity-50 transition hover:scale-105 hover:opacity-100 active:scale-100`}>
				<span>
					{isLoading
						? 'Updating ...'
						: `${
								stripePlanPriceAmount <= purchasedPlanPriceAmount
									? 'Downgrade'
									: 'Upgrade'
						  } to ${stripePlanName}`}
				</span>
			</button>
		</fetcher.Form>
	)
}

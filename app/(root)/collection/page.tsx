import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { auth } from "@clerk/nextjs";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { QuestionFilters } from "@/constants/filters";

export default async function Home() {
    const { userId } = auth();

    if (!userId) return null;

	const result = await getSavedQuestions({
        clerkId: userId!,
    });
	if (result)
		return (
			<>
					<h1 className="h1-bold text-dark100_light900">
						Saved Questions
					</h1>

				<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
					<LocalSearchbar
						route="/"
						iconPosition="right"
						imgSrc="/assets/icons/search.svg"
						placeholder="Search for questions"
						otherClasses="flex-1"
					/>

					<Filter
						filters={QuestionFilters}
						otherClasses="min-h-[56px] sm:min-w-[170px]"
					/>
				</div>

				<div className="mt-10 flex w-full flex-col gap-6">
					{result.savedQuestions.length > 0 ? (
                        result.savedQuestions.map((question: any) => (
							<QuestionCard
								key={question._id}
								_id={question._id}
								title={question.title}
								tags={question.tags}
								author={question.author}
								upvotes={question.upvotes}
								views={question.views}
								answers={question.answers}
								createdAt={question.createdAt}
							/>
						))
					) : (
						<NoResult
							title="There is no saved question to show"
							description="Be the first to break the silence!  Save a question and kickstart the discussion. Our query could be the next big thing others learn from. Get involved"
							link="/ask-question"
							linkTitle="Ask a Question"
						/>
					)}
				</div>
			</>
		);
}

"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
	GetAllTagsParams,
	GetQuestionsByTagIdParams,
	GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
	try {
		await connectToDatabase();

		const { userId } = params;

		const user = await User.findById(userId);

		if (!user) throw new Error("User not found");

		// find interactions for the user and group by tags...
		// Interactions...

		return [
			{ _id: "1", name: "tag" },
			{ _id: "2", name: "tag2" },
		];
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getAllTags() {
	try {
		await connectToDatabase();

		const tags = await Tag.find({});

		return { tags };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
	try {
		await connectToDatabase();

		const { tagId, searchQuery } = params;

		const tagFilter: FilterQuery<ITag> = { _id: tagId };

		const tag = await Tag.findOne(tagFilter).populate({
			path: "questions",
			model: Question,
			match: searchQuery
				? { title: { $regex: searchQuery, $options: "i" } }
				: {},
			options: {
				sort: { createdAt: -1 },
			},
			populate: [
				{ path: "tags", model: "Tag", select: "_id name" },
				{
					path: "author",
					model: "User",
					select: "_id clerkId name picture",
				},
			],
		});

		if (!tag) {
			throw new Error("Tag not found");
		}

		const questions = tag.questions;

		return { tagTitle: tag.name, questions };

		// return { tags };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

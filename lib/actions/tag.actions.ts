"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
	GetAllTagsParams,
	GetQuestionsByTagIdParams,
	GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import { FilterQuery, _FilterQuery } from "mongoose";
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

export async function getAllTags(params: GetAllTagsParams) {
	try {
		await connectToDatabase();

		const { searchQuery, filter, page =1, pageSize = 1 } = params;

		const skipAmount = (page - 1) * pageSize;

		const query: _FilterQuery<typeof Tag> ={};

		if(searchQuery) {
			query.$or = [{name: {$regex: new RegExp(searchQuery, "i")}}]
		}

		let sortOptions = {};

		switch(filter){
			case "popular":
				sortOptions = { question: 1 }
			break;
			case "recent":
				sortOptions = { createdAt: -1 }
	   		break;
		case "name":
			sortOptions = { name: 1 }
		break;
		case "old":
			sortOptions = { createdAt: 1 }
		break;
		default:
		break;
		}

		const totalTags = await Tag.countDocuments(query);
		const tags = await Tag.find(query)
		.sort(sortOptions)
		.skip(skipAmount)
		.limit(pageSize);

		const isNext = totalTags > skipAmount+tags.length;

		return { tags, isNext };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
	try {
		await connectToDatabase();

		const { tagId, searchQuery, page = 1, pageSize = 1 } = params;

		const skipAmount = (page - 1) * pageSize;

		const tagFilter: FilterQuery<ITag> = { _id: tagId };

		const tag = await Tag.findOne(tagFilter).populate({
			path: "questions",
			model: Question,
			match: searchQuery
				? { title: { $regex: searchQuery, $options: "i" } }
				: {},
			options: {
				sort: { createdAt: -1 },
				skip: skipAmount,
				limit: pageSize + 1,
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

		const isNext = tag.Questions.length > pageSize;

		return { tagTitle: tag.name, questions, isNext };

		// return { tags };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function getTopPopularTags() {
	try{
		await connectToDatabase();

		const popularTags = await Tag.aggregate([
			{ $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
			{ $sort: { numberOfQuestions: -1 } },
			{ $limit: 5 }
		])

		return popularTags;
	} catch (error) {
		console.log(error);
		throw error;
	}
}
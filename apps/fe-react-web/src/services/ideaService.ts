import type { TIdea } from "../schema/ideas.schema";
import { IdeaSchema } from "../schema/ideas.schema";
import type { IApiResponse } from "../types/response.type";

const BASE_URL = `${import.meta.env.VITE_API_URL}/ideas`;

export const ideaService = {
  async getIdea(id: number): Promise<TIdea> {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = (await res.json()) as IApiResponse<TIdea>;
      console.log("getIdea response:", json);

      if (!json.data) {
        throw new Error("No data in response");
      }

      const idea = json.data;
      return IdeaSchema.parse({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        author: {
          id: idea.author.id,
          fullName: idea.author.fullName,
          email: idea.author.email,
          role: idea.author.role,
        },
        group: {
          id: idea.group.id,
          title: idea.group.title,
        },
        status: idea.status,
        createdAt: idea.createdAt,
        updatedAt: idea.updatedAt,
      });
    } catch (error) {
      console.error("Error in getIdea:", error);
      throw error;
    }
  },

  async getIdeas(): Promise<TIdea[]> {
    try {
      const res = await fetch(BASE_URL, {
        headers: {
          "Content-Type": "application/json",
          // Thêm Authorization header nếu cần
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = (await res.json()) as IApiResponse<TIdea[]>;
      console.log("getIdeas API Response:", json);

      if (!json.data) {
        throw new Error("No data field in response");
      }

      if (!Array.isArray(json.data)) {
        throw new Error("Data is not an array");
      }

      console.log("Processing array of ideas, length:", json.data.length);

      return json.data.map((idea: TIdea, index: number) => {
        try {
          console.log(`Mapping idea ${index}:`, idea);

          const mappedIdea = {
            id: idea.id,
            title: idea.title,
            description: idea.description,
            author: {
              id: idea.author.id,
              fullName: idea.author.fullName,
              email: idea.author.email,
              role: idea.author.role,
            },
            group: {
              id: idea.group.id,
              title: idea.group.title,
            },
            status: idea.status,
            createdAt: idea.createdAt,
            updatedAt: idea.updatedAt,
          };

          console.log(`Mapped idea ${index}:`, mappedIdea);

          return IdeaSchema.parse(mappedIdea);
        } catch (error) {
          console.error(`Parse error for idea ${index}:`, idea);
          console.error("Parse error details:", error);
          throw error;
        }
      });
    } catch (error) {
      console.error("Error in getIdeas:", error);
      throw error;
    }
  },

  async createIdea(data: { title: string; description: string; groupId: number }): Promise<TIdea> {
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = (await res.json()) as IApiResponse<TIdea>;
      console.log("createIdea response:", json);

      if (!json.data) {
        throw new Error("No data in response");
      }

      const idea = json.data;
      return IdeaSchema.parse({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        author: {
          id: idea.author.id,
          fullName: idea.author.fullName,
          email: idea.author.email,
          role: idea.author.role,
        },
        group: {
          id: idea.group.id,
          title: idea.group.title,
        },
        status: idea.status,
        createdAt: idea.createdAt,
        updatedAt: idea.updatedAt,
      });
    } catch (error) {
      console.error("Error in createIdea:", error);
      throw error;
    }
  },

  async updateIdea(
    id: number,
    data: {
      title?: string;
      description?: string;
      status?: string;
    },
  ): Promise<TIdea> {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = (await res.json()) as IApiResponse<TIdea>;
      console.log("updateIdea response:", json);

      if (!json.data) {
        throw new Error("No data in response");
      }

      const idea = json.data;
      return IdeaSchema.parse({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        author: {
          id: idea.author.id,
          fullName: idea.author.fullName,
          email: idea.author.email,
          role: idea.author.role,
        },
        group: {
          id: idea.group.id,
          title: idea.group.title,
        },
        status: idea.status,
        createdAt: idea.createdAt,
        updatedAt: idea.updatedAt,
      });
    } catch (error) {
      console.error("Error in updateIdea:", error);
      throw error;
    }
  },

  async deleteIdea(id: number): Promise<void> {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      console.log("deleteIdea success for id:", id);
    } catch (error) {
      console.error("Error in deleteIdea:", error);
      throw error;
    }
  },
};

export type { TIdea };

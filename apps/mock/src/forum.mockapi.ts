// Forum types
export interface ForumPost {
  id: number;
  avatarUrl?: string;
  authorName: string;
  groupName?: string | null;
  postType: string;
  title: string;
  content: string;
  imageUrl?: string;
}

// Mock data
export const forumPosts: ForumPost[] = [
  {
    id: 1,
    avatarUrl: "/avatar1.png",
    authorName: "Nguyễn Văn A",
    groupName: "Nhóm AI",
    postType: "Tìm nhóm",
    title: "Tìm nhóm làm đồ án AI",
    content: "Mình đang tìm nhóm để cùng làm đồ án AI cuối kỳ, bạn nào hứng thú thì liên hệ nhé...",
    imageUrl: "/post1.png",
  },
  {
    id: 2,
    avatarUrl: "/avatar2.png",
    authorName: "Trần Thị B",
    groupName: null,
    postType: "Chia sẻ",
    title: "Kinh nghiệm làm bài tập lớn",
    content: "Mình muốn chia sẻ vài kinh nghiệm khi làm bài tập lớn môn CSDL...",
  },
  {
    id: 3,
    avatarUrl: "/avatar3.png",
    authorName: "Lê Văn C",
    groupName: "N/A",
    postType: "Thảo luận",
    title: "Có ai học môn Hệ điều hành không?",
    content: "Mọi người có thấy bài tập môn này khó không, vào thảo luận chút nào...",
    imageUrl: "/post2.png",
  },
];

// ========== BaseResponse type ==========
export type BaseResponse<T> = {
  status: number;
  message: string;
  data: T;
};

// Lấy tất cả bài viết
export const getAllForumPosts = (): BaseResponse<ForumPost[]> => {
  return {
    status: 200,
    message: "Forum posts fetched successfully",
    data: forumPosts,
  };
};

// Lấy chi tiết theo id
export const getForumPostById = (id: number): BaseResponse<ForumPost | null> => {
  const post = forumPosts.find((p) => p.id === id) || null;
  return {
    status: post ? 200 : 404,
    message: post ? "Post found" : "Post not found",
    data: post,
  };
};

// Thêm bài viết mới
export const createForumPost = (newPost: ForumPost): BaseResponse<ForumPost> => {
  const id = forumPosts.length + 1;
  const post = { ...newPost, id };
  forumPosts.push(post);
  return {
    status: 201,
    message: "Post created successfully",
    data: post,
  };
};

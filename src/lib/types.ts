export type Guest = {
    id: number;
    guest_id: string;
    name: string;
    email: string;
  };

export type chat = {
    user_id: string;
    thread_name: string;
    thread_id: string;
}

export type Weather = {
  temp: string; // Temperature as a string
  feels: string;
  description: string; // Weather description
  icon: string;
};

export type NewsArticle = {
  headline: string; // News headline
  url: string; // URL to the article
};

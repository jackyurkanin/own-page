export type Guest = {
    id: number;
    user_id: string;
    name: string;
    email: string;
    law: string; 
    psych: string; 
    medicine: string;
    misc: string;
  };

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

export type Assistants = {
  law: string;
  psych: string; 
  medicine: string;
  misc: string;
}
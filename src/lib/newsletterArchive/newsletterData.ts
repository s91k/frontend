export type NewsletterType = {
  id: string;
  send_time: string;
  long_archive_url: string;
};

export type NewsletterArchiveList = {
  newsletters: NewsletterType[];
};

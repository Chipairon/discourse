import { cook, setup } from 'pretty-text/engines/discourse-markdown';
import { sanitize } from 'pretty-text/sanitizer';
import WhiteLister from 'pretty-text/white-lister';

const identity = value => value;

export function buildOptions(siteSettings) {
  const features = {
    table: !!siteSettings.allow_html_tables,
    emoji: !!siteSettings.enable_emoji,
    'bold-italics': true,
    'auto-link': true,
    'mentions': true,
    'code': true,
    'bbcode': true,
    'quote': true,
    'html': true,
    'category-hashtag': true,
    'onebox': true,
    'censored': true,
    'newline': true
  };

  return {
    sanitize: true,
    features
  };
}

export default class {
  constructor(opts) {
    opts = opts || {};
    this.opts = opts;
    this.features = opts.features || {};
    this.sanitizer = (!!opts.sanitize) ? (opts.sanitizer || sanitize) : identity;
    setup();
  }

  cook(raw) {
    const { opts } = this;
    if (!raw || raw.length === 0) { return ""; }

    const cookArgs = { traditionalMarkdownLinebreaks: opts.traditionalMarkdownLinebreaks,
                       defaultCodeLang: opts.defaultCodeLang || Discourse.SiteSettings.default_code_lang,
                       topicId: opts.topicId,
                       lookupAvatar: opts.lookupAvatar,
                       mentionLookup: opts.mentionLookup,
                       categoryHashtagLookup: opts.categoryHashtagLookup,
                       features: this.features,
                       sanitizer: this.sanitizer };

    const result = cook(raw, cookArgs);
    return result ? result : "";
  }

  sanitize(html) {
    return this.sanitizer(html, new WhiteLister(this.features));
  }
};

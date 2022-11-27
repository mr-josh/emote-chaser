import EmoteLib from "emotelib";
import IEmote from "emotelib/dist/interfaces/IEmote";

const standardEmotes = new EmoteLib({
  client_id: undefined,
  access_token: undefined,
});

let bttv: IEmote.BTTV[];
let bttvCodes: string[];

standardEmotes.betterttv.getGlobalEmotes().then((emotes) => {
  bttv = emotes!;
  bttvCodes = emotes!.map((e) => e.code!);
});

const getUrl = (id: string) => {
  return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0`;
};

const getBTTVUrl = (id: string) => {
  return `https://cdn.betterttv.net/emote/${id}/3x`;
};

const emotify = (message: string, emotes: { [id: string]: string[] } = {}) => {
  const replacements = [];

  // Normal twitch emotes
  for (const [emoteId, positions] of Object.entries(emotes ?? {})) {
    const [start, end] = positions[0].split("-");
    const emoteKey = message.substring(+start, +end + 1);

    replacements.push({
      key: emoteKey,
      value: getUrl(emoteId),
    });
  }

  // BTTV emotes
  if (bttv) {
    for (const [i, code] of bttvCodes.entries()) {
      if (message.includes(code)) {
        replacements.push({
          key: code,
          value: getBTTVUrl(bttv[i].id!),
        });
      }
    }
  }

  if (Object.values(replacements).length <= 0) return null;

  return Object.values(replacements);
};

export default emotify;

import 'dayjs/locale/zh-cn';

export const locales = ['en', 'zh-cn']

export const localeMessages = {}

for (const locale of locales) {
  localeMessages[locale] = (await import(`./locales/${locale}.js`)).default
}

console.log('load theme reorx', localeMessages)

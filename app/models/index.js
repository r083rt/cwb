import Realm from 'realm';
import BookmarkSchema from './BookmarkSchema';
import HistorySchema from './HistorySchema';
import SettingSchema from './SettingSchema';

const realm = new Realm({
  schema: [BookmarkSchema, HistorySchema, SettingSchema],
  schemaVersion: 1,
});

export default realm;

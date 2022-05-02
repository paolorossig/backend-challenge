import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const characterSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String },
    imageUrl: { type: String },
    comicsAvailable: { type: Number },
    seriesAvailable: { type: Number },
    storiesAvailable: { type: Number },
    wikiUrl: { type: String },
  },
  { timestamps: true }
);

characterSchema.plugin(mongoosePaginate);

const Character = mongoose.model('Character', characterSchema);

export default Character;

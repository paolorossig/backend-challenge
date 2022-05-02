import Character from '../models/chraracter.model.js';

export async function getCharacters(req, res) {
  try {
    const { limit, offset } = req.query;
    const characters = await Character.paginate({}, { limit, offset });

    res.status(200).json({
      status: 'success',
      data: { total: characters.totalDocs, characters: characters.docs },
    });
  } catch (error) {
    res.status(400).json({ status: 'failed', message: error.message });
  }
}

export async function uploadCharacters(req, res) {
  const { characters } = req.body;

  try {
    const created = await Character.insertMany(characters);

    res.status(201).json({
      status: 'success',
      message: `${created.length} characters uploaded successfully`,
    });
  } catch (error) {
    res.status(400).json({ status: 'failed', message: error.message });
  }
}

export async function deleteCharacters(req, res) {
  try {
    await Character.deleteMany({});

    res.status(200).json({
      status: 'success',
      message: 'All characters deleted successfully',
    });
  } catch (error) {
    res.status(400).json({ status: 'failed', message: error.message });
  }
}

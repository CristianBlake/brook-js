const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Brook 💀 tocará una canción para ti')
    .addStringOption( (option) => option.setName('song').setDescription('Dime el URL o nombre de la canción').setRequired(true)),
  async execute(interaction) {    
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('💀 ¡Necesitas estar en un canal de voz ¡YOHOHO!!');

    const player = useMainPlayer();
    const query = interaction.options.getString('song', true);

    // let's defer the interaction as things can take time to process
    await interaction.deferReply();

    try {
        const { track } = await player.play(channel, query, {
            nodeOptions: {
                // nodeOptions are the options for guild node (aka your queue in simple word)
                metadata: interaction // we can access this metadata object using queue.metadata later on
            }
        });

    const embedTemplate = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(`${track.title} - ${track.author}`)
      .setURL(track.url)
      .setAuthor({ name: `Brook agregó esta canción a la lista`, iconURL: 'https://cdn.discordapp.com/app-icons/1110364188066451586/a37b6de114a0b7f575bbcb857d35fb44.png'})
      .setThumbnail(track.thumbnail)
      .setFooter({ text: `Duración: ${track.duration}` });

        return interaction.followUp({ embeds: [ embedTemplate ]});
    } catch (e) {
        return interaction.followUp(`💀 Parece que algo salió mal, por favor ¿podrías mostrarme tus pantis?`);
    }
  },
};

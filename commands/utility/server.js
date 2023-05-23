const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provee información sobre el servidor 💀'),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(`El server ${interaction.guild.name} tiene ${interaction.guild.memberCount} miembros 💀`);
	},
};
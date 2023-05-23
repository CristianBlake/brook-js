const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Brook responde con Pong!'),
	async execute(interaction) {
		await interaction.reply('💀 Pong!');
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('participate')
		.setDescription('Adds participant to waifu war'),
	async execute(interaction) {
    await interaction.reply(`you want to add a participant`);
	},
};
import { test, expect } from '@playwright/test';
import { expectCollectedData, goToStory } from './utils';

test.describe('Checkboxes', () => {
	test.describe('CheckboxGroup', () => {
		test(`Keyboard shortcut should check boxes`, async ({ page }) => {
			await goToStory(page, 'components-checkboxgroup--default');
			await expect(
				page.getByRole('checkbox', { name: 'Janvier' })
			).toBeVisible();
			await page.keyboard.type('ab');
			await expect(
				page.getByRole('checkbox', { name: 'Janvier' })
			).toHaveAttribute('aria-checked', 'true');
			await expect(
				page.getByRole('checkbox', { name: 'Février' })
			).toHaveAttribute('aria-checked', 'true');
			await expect(
				page.getByRole('checkbox', { name: 'Mars' })
			).not.toHaveAttribute('aria-checked', 'true');
			await expectCollectedData(page, 'MOIS1', true);
			await expectCollectedData(page, 'MOIS2', true);
			await expectCollectedData(page, 'MOIS3', null);
		});

		test(`Keyboard shortcut should be disabled in readonly`, async ({
			page,
		}) => {
			await goToStory(page, 'components-checkboxgroup--read-only');
			await expect(
				page.getByRole('checkbox', { name: 'Janvier' })
			).toBeVisible();
			await page.keyboard.type('ab');
			await expect(
				page.getByRole('checkbox', { name: 'Janvier' })
			).not.toHaveAttribute('aria-checked', 'true');
			await expectCollectedData(page, 'MOIS2', null);
		});

		test('Can select arbitrary value', async ({ page }) => {
			await goToStory(page, 'components-checkboxgroup--arbitrary');
			const selector = page.getByRole('checkbox', { name: 'Autre préciser' });
			await expect(selector).toBeVisible();
			await selector.click();
			await expect(selector).toHaveAttribute('aria-checked', 'true');
			await page
				.getByRole('textbox', { name: 'Préciser' })
				.fill('Demonstration');
			await expectCollectedData(page, 'NATIO1N_OTHER', true);
			await expectCollectedData(page, 'NATIO1N_DETAIL', 'Demonstration');
		});
	});

	test.describe('CheckboxOne', () => {
		test(`Allow keyboard a11y`, async ({ page }) => {
			await goToStory(page, 'components-checkboxone--default');
			await expect(page.getByRole('radio', { name: 'oui' })).toBeVisible();
			await page.mouse.click(0, 0);
			await page.keyboard.press('Tab');
			await page.keyboard.press('Space');
			await expectCollectedData(page, 'Q2', '1');
			await page.mouse.click(0, 0);
			await page.keyboard.press('Tab');
			await page.keyboard.press('Space');
			await expectCollectedData(page, 'Q2', '2');
		});
		test(`Allow detail selection`, async ({ page }) => {
			await goToStory(page, 'components-checkboxone--with-detail');
			await expect(page.getByRole('radio', { name: 'Autre' })).toBeVisible();
			await page.getByRole('radio', { name: 'Autre' }).click();
			await page.getByRole('textbox', { name: 'Préciser' }).fill('Bonjour');
			await expectCollectedData(page, 'Q2', '3');
			await expectCollectedData(page, 'Q3', 'Bonjour');
		});
	});
});

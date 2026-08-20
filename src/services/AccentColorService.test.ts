import { describe, expect, it } from 'vitest';
import { FakeMemento } from '../test/FakeMemento';
import { AccentColorService } from './AccentColorService';

describe('AccentColorService', () => {
    it('should default to undefined (theme accent)', () => {
        const service = new AccentColorService(new FakeMemento());

        expect(service.getAccentColor()).toBeUndefined();
    });

    it('should persist the chosen color', () => {
        const service = new AccentColorService(new FakeMemento());

        service.setAccentColor('#5b9bd5');

        expect(service.getAccentColor()).toBe('#5b9bd5');
    });

    it('should allow resetting back to the theme default', () => {
        const service = new AccentColorService(new FakeMemento());

        service.setAccentColor('#5b9bd5');
        service.setAccentColor(undefined);

        expect(service.getAccentColor()).toBeUndefined();
    });

    it('should notify listeners when the color changes', () => {
        const service = new AccentColorService(new FakeMemento());

        let notifications = 0;
        service.onDidChangeAccentColor(() => {
            notifications++;
        });

        service.setAccentColor('#5b9bd5');
        service.setAccentColor(undefined);

        expect(notifications).toBe(2);
    });
});

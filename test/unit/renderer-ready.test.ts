import { RendererReady } from '../../main/components/renderer-ready';



describe('RendererReady', () => {
    let rendererReady: RendererReady;

    beforeEach(() => {
        rendererReady = new RendererReady();
    });

    describe('setReady', () => {
        it('should add the ready_key to _ready array', () => {
            rendererReady.setReady('key1');
            expect(rendererReady.getReady()).toContain('key1');
        });

        it('should not add the ready_key if _ready_end is reached', () => {
            rendererReady.setEnd(1);
            rendererReady.setReady('key1');
            rendererReady.setReady('key2');
            expect(rendererReady.getReady()).not.toContain('key2');
        });

        it('should not add the ready_key if it already exists in _ready array', () => {
            rendererReady.setReady('key1');
            rendererReady.setReady('key1');
            expect(rendererReady.getReady()).toHaveLength(1);
        });
    });

    describe('checkReady', () => {
        it('should return true if _ready length is greater than or equal to _ready_end', () => {
            rendererReady.setEnd(2);
            rendererReady.setReady('key1');
            rendererReady.setReady('key2');
            expect(rendererReady.checkReady()).toBe(true);
        });

        it('should return false if _ready length is less than _ready_end', () => {
            rendererReady.setEnd(3);
            rendererReady.setReady('key1');
            expect(rendererReady.checkReady()).toBe(false);
        });
    });

    describe('CheckAndSetReady', () => {
        it('should add the ready_key to _ready array', () => {
            rendererReady.CheckAndSetReady('key1');
            expect(rendererReady.getReady()).toContain('key1');
        });

        it('should return true if _ready length is greater than or equal to _ready_end', () => {
            rendererReady.setEnd(2);
            rendererReady.CheckAndSetReady('key1');
            rendererReady.CheckAndSetReady('key2');
            expect(rendererReady.CheckAndSetReady('key3')).toBe(true);
        });

        it('should return false if _ready length is less than _ready_end', () => {
            rendererReady.setEnd(3);
            rendererReady.CheckAndSetReady('key1');
            expect(rendererReady.CheckAndSetReady('key2')).toBe(false);
        });
    });

    describe('getReady', () => {
        it('should return the _ready array', () => {
            rendererReady.setReady('key1');
            rendererReady.setReady('key2');
            expect(rendererReady.getReady()).toEqual(['key1', 'key2']);
        });
    });

    describe('getEnd', () => {
        it('should return the initial value of _ready_end', () => {
            expect(rendererReady.getEnd()).toEqual(4);
        });
    });

    describe('setEnd', () => {
        it('should update the value of _ready_end', () => {
            rendererReady.setEnd(6);
            expect(rendererReady.getEnd()).toEqual(6);
        });

        it('should throw an error if ready_end is less than 0', () => {
            expect(() => {
                rendererReady.setEnd(-1);
            }).toThrowError('ready_end must be greater than or equal to 0');
        });
    });
});



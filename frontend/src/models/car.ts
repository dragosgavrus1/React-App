class Car{
    private id: number;
    private color: string;
    private make: string;
    private model: string;
    private year: number;
    constructor(id: number, make: string, model: string, year: number, color: string) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.year = year;
        this.color = color;
    }

    public getId(): number {
        return this.id;
    }
    public getMake(): string {
        return this.make;
    }
    public getModel(): string {
        return this.model;
    }
    public getYear(): number {
        return this.year;
    }
    public getColor(): string {
        return this.color;
    }
    public setMake(make: string): void {
        this.make = make;
    }
    public setModel(model: string): void {
        this.model = model;
    }
    public setYear(year: number): void {
        this.year = year;
    }
    public setColor(color: string): void {
        this.color = color;
    }

}

export default Car;
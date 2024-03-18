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
}

export default Car;
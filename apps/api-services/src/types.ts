export type Scenario = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  status: string;
  type: string; // "i think this should be an enum of the main "object types" in the system"
  data: {
    mainObjectType: string;
    totalRecords: number;
    fieldsData: [
      {
        type: string; // "this should be an enum of the field types available in the system and ideally the ones just for that object type"
        numberOfRecords?: number; // This is the number of records that should have this field populated
        fieldOptions?: string[]; // this will eventually have the options for the fields and probably specific to the field type, but would be things like "fuzzify", "no vowels", "no spaces", "no empty values", "no duplicates", "number of duplicates",
      }
    ];
  };
};

export type GeneralResponse = {
  status: string;
  message: string;
  data?: any;
  error?: any;
};

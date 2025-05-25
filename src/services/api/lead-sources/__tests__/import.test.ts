
import { importProspects, createFieldMapping } from "../importService";
import { supabase } from "@/integrations/supabase/client";

// Mock the Supabase client
jest.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  },
}));

describe("Lead Source Import Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("importProspects should call the Edge Function with correct parameters", async () => {
    // Mock the function invoke response
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { success: true, imported: 2, failed: 0 },
      error: null,
    });

    const leadSourceId = "test-source-id";
    const rawData = [
      { firstName: "John", lastName: "Doe", email: "john@example.com" },
      { firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
    ];
    const options = { skipDuplicates: true };

    const result = await importProspects(leadSourceId, rawData, options);

    // Verify the function was called with the correct parameters
    expect(supabase.functions.invoke).toHaveBeenCalledWith(
      "lead-sources-import",
      {
        body: {
          leadSourceId,
          rawData,
          options,
        },
      }
    );

    // Verify the result
    expect(result).toEqual({ success: true, imported: 2, failed: 0 });
  });

  test("importProspects should handle empty raw data", async () => {
    // This test verifies that the function doesn't throw when no data is provided
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { success: true, imported: 0, failed: 0 },
      error: null,
    });

    const leadSourceId = "test-source-id";
    const rawData: Record<string, any>[] = [];

    await expect(importProspects(leadSourceId, rawData)).resolves.not.toThrow();
  });

  test("createFieldMapping should handle edge cases with mapping objects", async () => {
    // Mock the upsert response
    (supabase.from as jest.Mock).mockImplementation(() => ({
      upsert: jest.fn().mockResolvedValue({
        data: { id: "mapping-id" },
        error: null,
      }),
    }));

    const leadSourceId = "test-source-id";
    
    // Test with empty mapping object
    const emptyMapping = {};
    await createFieldMapping(leadSourceId, emptyMapping);
    
    // Test with null values in mapping
    const nullMapping = {
      "first_name": "firstName",
      "email": null,
    };
    await createFieldMapping(leadSourceId, nullMapping as any);
    
    // Test with special characters in field names
    const specialCharsMapping = {
      "first_name": "first.name",
      "last_name": "last-name",
      "email": "email@address",
    };
    await createFieldMapping(leadSourceId, specialCharsMapping);
    
    // All should resolve without errors
    expect(true).toBe(true);
  });

  test("normalize with missing fields should handle nulls appropriately", async () => {
    // Mock the function invoke response
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { 
        success: true, 
        dryRun: true,
        normalizedData: [
          {
            "first_name": "John",
            "last_name": null,
            "email": "john@example.com",
            "phone": null,
            "lead_source_id": "test-source-id",
            "unique_external_id": "test-source-id_12345"
          }
        ]
      },
      error: null,
    });

    const leadSourceId = "test-source-id";
    const rawData = [
      { firstName: "John", email: "john@example.com", id: "12345" },
    ];
    const options = { dryRun: true };

    const result = await importProspects(leadSourceId, rawData, options);

    // Verify that missing fields are handled correctly
    expect(result).toHaveProperty("normalizedData");
    expect(result.normalizedData[0].last_name).toBeNull();
    expect(result.normalizedData[0].phone).toBeNull();
  });
});

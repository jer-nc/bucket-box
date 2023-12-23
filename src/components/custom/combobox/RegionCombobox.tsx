import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CheckIcon, SortAsc } from "lucide-react"
import { awsRegions } from "@/lib/aws-regions"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RegionComboboxProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any;
}
const RegionCombobox = ({ form }: RegionComboboxProps) => {



    return (
        <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
                <FormItem className="flex flex-col justify-end h-full">
                    <FormLabel>AWS Region</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-[200px] justify-between",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value
                                        ? awsRegions.find(
                                            (region) => region.value === field.value
                                        )?.label
                                        : "Select region"}
                                    <SortAsc className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Search AWS Region..."
                                    className="h-9"
                                />
                                <ScrollArea className="h-80">
                                <CommandEmpty>No region found.</CommandEmpty>
                                    <CommandGroup>
                                        {awsRegions.map((region) => (
                                            <CommandItem
                                                value={region.label}
                                                key={region.value}
                                                onSelect={() => {
                                                    form.setValue("region", region.value)
                                                }}
                                            >
                                                {region.label}
                                                <CheckIcon
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        region.value === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </ScrollArea>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormDescription>
                        Select the region in which you want to create the bucket.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
export default RegionCombobox
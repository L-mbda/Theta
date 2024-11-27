/*
    Generates service graph for service page and public
*/
'use client';

// Import libraries
import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';  
import { format } from 'date-fns';
import { Center, Loader } from "@mantine/core";

// Create interfaces
interface ServiceHistory {
    time: string;
    status: boolean;    
}

interface UptimePoint {
    timestamp: string;
    uptime: number;
}

interface ServiceGraphProps {
    id: string;
}

export function GenerateServiceGraph({id}: any) {
    // Get service history
    const [datapoint, setDataPoint] = useState<UptimePoint[]>([]);
    // Set loading state
    const [loadingState, setLoadingState] = useState(true);
    // Set error state
    const [errorState, setErrorState] = useState(false);
    // Use effect
    useEffect(() => {
        // Fetch service history
        const fetchServiceHistory = async () => {
            const response = await fetch(`/api/gin`, {
                'method': 'POST',
                'body': JSON.stringify({'id': id})
            });
            const data: {data: ServiceHistory[]} = await response.json();

            // Set service history state
            const uptimeData = data.data.map((datapoint: ServiceHistory) => {
                return {
                    timestamp: format(new Date(parseInt(datapoint.time)), 'MM/dd/yyyy HH:mm:ss'),
                    // @ts-ignore
                    uptime: datapoint.reachableStatus ? 1 : 0
                }
            })
            setDataPoint(uptimeData);
            setLoadingState(false);
        }
        fetchServiceHistory();
    }, [])
    return (
        <>
            {loadingState ? (<Center>
                <Loader variant="dots" size="xl" />
            </Center>) :
            (<>
                <ResponsiveContainer width={'100%'} height={400}>
                    <LineChart data={datapoint}>
                        <XAxis dataKey="timestamp"
                            tick={{fontSize: 14}}
                            angle={-2}
                        />
                        <YAxis tick={{
                            fontSize: 14
                        }}
                        domain={[0,1]}
                        ticks={[0,1]}
                        tickFormatter={(value) => (value == 1 ? 'Online' : 'Offline')} />
                        <Tooltip
                            contentStyle={{backgroundColor: '#2e2e2e', borderRadius: '10px', border: 'none'}}
                            labelFormatter={(l) => `Time ${l}`}
                            itemStyle={{color: 'white'}}
                            formatter={(value) => (value == 1 ? 'Online' : 'Offline')}
                        />
                        <Line

                            type="natural"
                            dataKey="uptime"
                            stroke="#007bff"
                            strokeWidth={2}
                            name="Status"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </>)}    
        </>
    )
}
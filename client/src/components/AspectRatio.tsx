import { RectangleHorizontal, RectangleVertical, Square } from 'lucide-react'
import React from 'react'
import { aspectRatios, type AspectRatioType } from '../assets/assets'

const AspectRatio = ({
    value,
    onChange
}: {
    value: AspectRatioType,
    onChange: (ratio: AspectRatioType) => void
}) => {

    const iconMap = {
        '16:9': <RectangleHorizontal className='size-6' />,
        '1:1': <Square className='size-6' />,
        '9:16': <RectangleVertical className='size-6' />
    } as Record<AspectRatioType, React.ReactNode>

    return (
        <div className='space-y-3 dark'>
            <label className='block text-sm font-medium'>Aspect Ratio</label>
            <div className='flex flex-wrap gap-2'>

                {aspectRatios.map((ratio) => {
                    const selected = value === ratio;
                    return (
                        <button
                            key={ratio}
                            type='button'
                            onClick={() => onChange(ratio)}
                            className={`flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm transition border-white/10 ${selected ? 'bg-white/10' : 'hover:bg-white/6'}`}
                        >
                            {iconMap[ratio]}
                            <span className='tracking-widest'>{ratio}</span>
                        </button>
                    )
                })}

            </div>
        </div>
    )
}

export default AspectRatio